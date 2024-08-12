import moment from 'moment'
import chunk from 'lodash/chunk'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, race, delay } from 'redux-saga/effects'
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
import { buildAlbumsMap, buildArtist, deleteArtists, deleteLabels, mergeAlbumsRaw } from 'helpers'
import { albumsNew, albumsHistory } from 'albums'
import {
  getSettings,
  getReleasesMaxDate,
  getSettingsBlockedArtists,
  getSettingsBlockedLabels,
} from 'state/selectors'
import {
  setFilters,
  setSyncingProgress,
  showErrorMessage,
  syncAnimationFinished,
  syncError,
  syncFinished,
  syncStart,
} from 'state/actions'
import { authorize } from './auth'
import {
  withTitle,
  requestWorker,
  putRequestMessage,
  getAllCursorPaged,
  getAllPaged,
} from './helpers'

const { ISO_DATE } = MomentFormat
const { FOLLOWED, SAVED_ALBUMS, SAVED_TRACKS } = ArtistSource

/**
 * Limit maximum number of concurrent requests
 */
const WORKERS_COUNT = 6

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
  const { days, fullAlbumData, trackHistory } = yield select(getSettings)
  /** @type {ReturnType<typeof getSettingsBlockedLabels>} */
  const blockedLabels = yield select(getSettingsBlockedLabels)
  /** @type {ReturnType<typeof getSettingsBlockedArtists>} */
  const blockedArtists = yield select(getSettingsBlockedArtists)
  /** @type {ReturnType<typeof getReleasesMaxDate>} */
  const previousSyncMaxDate = yield select(getReleasesMaxDate)

  /** @type {Task[]} */
  const workers = []
  const minDate = moment().subtract(days, 'day').format(ISO_DATE)

  /** @type {RequestChannel} */
  const requestChannel = yield call(channel, buffers.expanding(1000))
  /** @type {ResponseChannel} */
  const responseChannel = yield call(channel, buffers.expanding(WORKERS_COUNT))

  for (let i = 0; i < WORKERS_COUNT; i += 1)
    workers.push(yield fork(requestWorker, requestChannel, responseChannel, 9, 4000))

  /** @type {Await<ReturnType<typeof getUser>>} */
  const user = yield call(getUser, token)
  /** @type {Artist[]} */
  const artists = yield call(getArtists, requestChannel, responseChannel)

  /** @type {AlbumRaw[]} */
  const albumsRaw = yield call(syncBaseData, artists, requestChannel, responseChannel)

  /** @type {Await<ReturnType<typeof mergeAlbumsRaw>>} */
  const mergedAlbums = yield call(mergeAlbumsRaw, albumsRaw, minDate)
  /** @type {Await<ReturnType<typeof buildAlbumsMap>>} */
  const albums = yield call(buildAlbumsMap, mergedAlbums, artists)
  yield call(deleteArtists, albums, blockedArtists)

  if (fullAlbumData) {
    yield call(syncExtraData, albums, requestChannel, responseChannel)
    yield call(deleteLabels, albums, blockedLabels)
  }

  if (trackHistory) {
    yield call(updateHistory, albums)
  }

  yield cancel(workers)
  yield call(requestChannel.close)
  yield call(responseChannel.close)

  yield put(setSyncingProgress(100))
  yield race([take(syncAnimationFinished.type), delay(1000)])
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
  /** @type {ReturnType<typeof getSettingsBlockedArtists>} */
  const blockedArtists = yield select(getSettingsBlockedArtists)
  /** @type {Artist[]} */
  const allArtists = []
  /** @type {Record<string, Artist>} */
  const artists = {}

  if (artistSources.includes(FOLLOWED)) {
    /** @type {Artist[]} */
    const artists = yield call(getUserFollowedArtists, requestChannel, responseChannel)
    for (const artist of artists) allArtists.push(artist)
  }

  if (artistSources.includes(SAVED_TRACKS)) {
    /** @type {Artist[]} */
    const artists = yield call(getUserSavedTracksArtists, requestChannel, responseChannel)
    for (const artist of artists) allArtists.push(artist)
  }

  if (artistSources.includes(SAVED_ALBUMS)) {
    /** @type {Artist[]} */
    const artists = yield call(getUserSavedAlbumsArtists, requestChannel, responseChannel)
    for (const artist of artists) allArtists.push(artist)
  }

  for (const artist of allArtists) {
    if (artist.id in artists) continue
    if (blockedArtists.includes(artist.id)) continue
    artists[artist.id] = artist
  }

  return Object.values(artists)
}

/**
 * Fetch base album data
 *
 * @param {Artist[]} artists
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
function* syncBaseData(artists, requestChannel, responseChannel) {
  /** @type {AlbumRaw[]} */
  const albumsRaw = []
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getSettings>} */
  const { groups, fullAlbumData } = yield select(getSettings)
  const minDate = moment().subtract(1, 'year').format(ISO_DATE)

  for (const artist of artists)
    yield putRequestMessage(requestChannel, [getArtistAlbums, token, artist.id, groups, minDate])

  for (let fetched = 0; fetched < artists.length; fetched += 1) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof getArtistAlbums>>>} */
    const response = yield take(responseChannel)

    let newProgress = ((fetched + 1) / artists.length) * 100
    if (fullAlbumData) newProgress *= BASE_SYNC_RATIO
    yield put(setSyncingProgress(newProgress))

    if (response.error) continue
    for (const album of response.result) albumsRaw.push(album)
  }

  return albumsRaw
}

/**
 * Fetch extra album data
 *
 * @param {AlbumsMap} albums
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
function* syncExtraData(albums, requestChannel, responseChannel) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  const albumIdsChunks = chunk(Object.keys(albums), 20)

  for (const albumIdsChunk of albumIdsChunks)
    yield putRequestMessage(requestChannel, [getFullAlbums, token, albumIdsChunk])

  for (let fetched = 0; fetched < albumIdsChunks.length; fetched += 1) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof getFullAlbums>>>} */
    const response = yield take(responseChannel)

    let newProgress = ((fetched + 1) / albumIdsChunks.length) * 100
    newProgress *= 1 - BASE_SYNC_RATIO
    newProgress += BASE_SYNC_RATIO * 100
    yield put(setSyncingProgress(newProgress))

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
    WORKERS_COUNT,
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
    WORKERS_COUNT,
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

/** @param {AlbumsMap} albums */
function* updateHistory(albums) {
  albumsHistory.append(albumsNew)
  yield call(albumsNew.clear)

  for (const id of Object.keys(albums)) {
    if (albumsHistory.has(id)) continue
    albumsNew.add(id)
  }

  yield call(albumsNew.persist)
  yield call(albumsHistory.persist)

  if (albumsNew.size > 0 && albumsHistory.size > 0) {
    yield put(setFilters({ newOnly: true }))
  }
}
