import moment from 'moment'
import chunk from 'lodash/chunk'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, delay } from 'redux-saga/effects'
import { ArtistSource, MomentFormat } from 'enums'
import {
  getArtistAlbums,
  getFullAlbums,
  getUser,
  getUserFollowedArtistsPage,
  getUserSavedAlbumsPage,
  getUserSavedTracksPage,
} from 'api'
import { getAuthData, getSyncScopes } from 'auth'
import { getSettings, getReleasesMaxDate } from 'state/selectors'
import {
  setSyncingProgress,
  showErrorMessage,
  syncError,
  syncFinished,
  syncStart,
} from 'state/actions'
import { authorize } from './auth'
import {
  withTitle,
  progressWorker,
  requestWorker,
  putRequestMessage,
  getAllCursorPaged,
  getAllPaged,
} from './helpers'
import { buildAlbumsMap, buildArtist, deleteLabels, mergeAlbumsRaw } from 'helpers'

const { ISO_DATE } = MomentFormat
const { FOLLOWED, SAVED_ALBUMS, SAVED_TRACKS } = ArtistSource

/**
 * Limit maximum number of concurrent requests
 */
const REQUEST_WORKERS_COUNT = 6

/**
 * Loading bar animation duration in milliseconds
 */
const LOADING_ANIMATION = 400

/**
 * How much percentage of overall progress is assigned to base sync when extra data fetch is enabled
 */
const BASE_SYNC_RATIO = 0.75

/**
 * Synchronization saga
 *
 * @param {SyncAction} action
 */
export function* syncSaga(action) {
  try {
    /** @type {ReturnType<typeof getSettings>} */
    const { artistSources } = yield select(getSettings)
    /** @type {ReturnType<typeof getSyncScopes>} */
    const scopes = yield call(getSyncScopes, artistSources)

    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(withTitle, 'Loading...', syncMainSaga, action)
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, scopes, titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(syncError())
  }
}

/**
 * Main synchronization saga
 *
 * @param {SyncAction} action
 */
function* syncMainSaga(action) {
  yield put(syncStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getSettings>} */
  const { days, fullAlbumData, labelBlocklist } = yield select(getSettings)
  /** @type {ReturnType<typeof getReleasesMaxDate>} */
  const previousSyncMaxDate = yield select(getReleasesMaxDate)

  /** @type {Task[]} */
  const tasks = []
  /** @type {Progress} */
  const progress = { value: 0 }
  const minDate = moment().subtract(days, 'day').format(ISO_DATE)

  /** @type {RequestChannel} */
  const requestChannel = yield call(channel, buffers.expanding(1000))
  /** @type {ResponseChannel} */
  const responseChannel = yield call(channel, buffers.expanding(REQUEST_WORKERS_COUNT))

  for (let i = 0; i < REQUEST_WORKERS_COUNT; i += 1)
    tasks.push(yield fork(requestWorker, requestChannel, responseChannel))

  tasks.push(yield fork(progressWorker, progress, setSyncingProgress, LOADING_ANIMATION))

  /** @type {Await<ReturnType<typeof getUser>>} */
  const user = yield call(getUser, token)
  /** @type {Artist[]} */
  const artists = yield call(getArtists, requestChannel, responseChannel)

  /** @type {AlbumRaw[]} */
  const albumsRaw = yield call(
    syncBaseData,
    artists,
    minDate,
    requestChannel,
    responseChannel,
    progress
  )

  /** @type {Await<ReturnType<typeof mergeAlbumsRaw>>} */
  const mergedAlbums = yield call(mergeAlbumsRaw, albumsRaw, minDate)
  /** @type {Await<ReturnType<typeof buildAlbumsMap>>} */
  const albums = yield call(buildAlbumsMap, mergedAlbums, artists)

  if (fullAlbumData) {
    yield call(syncExtraData, mergedAlbums, albums, requestChannel, responseChannel, progress)
    yield call(deleteLabels, albums, labelBlocklist)
  }

  yield cancel(tasks)
  yield call(requestChannel.close)
  yield call(responseChannel.close)
  yield delay(LOADING_ANIMATION)
  yield put(syncFinished({ albums, user, previousSyncMaxDate, auto: action.payload?.auto }))
}

/**
 * Get artists based on selected sources
 *
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
function* getArtists(requestChannel, responseChannel) {
  /** @type {ReturnType<typeof getSettings>} */
  const { artistSources } = yield select(getSettings)
  /** @type {Artist[]} */
  const allArtists = []
  /** @type {Record<string, Artist>} */
  const artists = {}

  if (artistSources.includes(FOLLOWED)) {
    /** @type {Artist[]} */
    const artists = yield call(getUserFollowedArtists, requestChannel, responseChannel)
    allArtists.push(...artists)
  }

  if (artistSources.includes(SAVED_TRACKS)) {
    /** @type {Artist[]} */
    const artists = yield call(getUserSavedTracksArtists, requestChannel, responseChannel)
    allArtists.push(...artists)
  }

  if (artistSources.includes(SAVED_ALBUMS)) {
    /** @type {Artist[]} */
    const artists = yield call(getUserSavedAlbumsArtists, requestChannel, responseChannel)
    allArtists.push(...artists)
  }

  for (const artist of allArtists) {
    if (artist.id in artists) continue
    artists[artist.id] = artist
  }

  return Object.values(artists)
}

/**
 * Fetch base album data
 *
 * @param {Artist[]} artists
 * @param {string} minDate
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {Progress} progress
 */
function* syncBaseData(artists, minDate, requestChannel, responseChannel, progress) {
  /** @type {AlbumRaw[]} */
  const albumsRaw = []
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getSettings>} */
  const { groups, fullAlbumData } = yield select(getSettings)

  for (const artist of artists)
    yield putRequestMessage(requestChannel, [getArtistAlbums, token, artist.id, groups, minDate])

  for (let fetched = 0; fetched < artists.length; fetched += 1) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof getArtistAlbums>>>} */
    const response = yield take(responseChannel)

    let newProgress = ((fetched + 1) / artists.length) * 100
    if (fullAlbumData) newProgress *= BASE_SYNC_RATIO
    progress.value = newProgress

    if (response.error) continue

    albumsRaw.push(...response.result)
  }

  return albumsRaw
}

/**
 * Fetch extra album data
 *
 * @param {AlbumRaw[]} albumsRaw
 * @param {AlbumsMap} albums
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {Progress} progress
 */
function* syncExtraData(albumsRaw, albums, requestChannel, responseChannel, progress) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  const albumIds = albumsRaw.map((album) => album.id)
  const albumIdsChunks = chunk(albumIds, 20)

  for (const albumIdsChunk of albumIdsChunks)
    yield putRequestMessage(requestChannel, [getFullAlbums, token, albumIdsChunk])

  for (let fetched = 0; fetched < albumIdsChunks.length; fetched += 1) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof getFullAlbums>>>} */
    const response = yield take(responseChannel)

    let newProgress = ((fetched + 1) / albumIdsChunks.length) * 100
    newProgress *= 1 - BASE_SYNC_RATIO
    newProgress += BASE_SYNC_RATIO * 100
    progress.value = newProgress

    if (response.error) continue

    for (const albumFull of response.result) {
      const { id, label, popularity } = albumFull
      Object.assign(albums[id], { label, popularity })
    }
  }
}

/**
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
function* getUserFollowedArtists(requestChannel, responseChannel) {
  /** @type {SpotifyArtist[]} */
  const artists = yield call(
    getAllCursorPaged,
    requestChannel,
    responseChannel,
    getUserFollowedArtistsPage
  )

  return artists.map(buildArtist)
}

/**
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
function* getUserSavedTracksArtists(requestChannel, responseChannel) {
  /** @type {ReturnType<typeof getSettings>} */
  const { minimumSavedTracks } = yield select(getSettings)
  /** @type {Record<string, { count: number; artist: Artist}>} */
  const artists = {}

  /** @type {SpotifySavedTrack[]} */
  const tracks = yield call(
    getAllPaged,
    requestChannel,
    responseChannel,
    REQUEST_WORKERS_COUNT,
    getUserSavedTracksPage
  )

  for (const item of tracks) {
    for (const artist of item.track.artists) {
      if (artist.id in artists) {
        artists[artist.id].count++
        continue
      }

      artists[artist.id] = { count: 1, artist }
    }
  }

  return Object.values(artists)
    .filter(({ count }) => count >= minimumSavedTracks)
    .map(({ artist }) => buildArtist(artist))
}

/**
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
function* getUserSavedAlbumsArtists(requestChannel, responseChannel) {
  /** @type {Record<string, Artist>} */
  const artists = {}

  /** @type {SpotifySavedAlbum[]} */
  const albums = yield call(
    getAllPaged,
    requestChannel,
    responseChannel,
    REQUEST_WORKERS_COUNT,
    getUserSavedAlbumsPage
  )

  for (const item of albums) {
    for (const artist of item.album.artists) {
      if (artist.id in artists) continue
      artists[artist.id] = artist
    }
  }

  return Object.values(artists).map(buildArtist)
}
