import moment from 'moment'
import chunk from 'lodash/chunk'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, delay } from 'redux-saga/effects'
import { MomentFormat, Scope } from 'enums'
import { getUser, getUserFollowedArtists, getArtistAlbums, getFullAlbums } from 'api'
import { AuthError, getAuthData } from 'auth'
import { getSettings, getReleasesMaxDate } from 'state/selectors'
import {
  setSyncingProgress,
  showErrorMessage,
  syncError,
  syncFinished,
  syncStart,
} from 'state/actions'
import { authorize } from './auth'
import { withTitle, progressWorker, requestWorker } from './helpers'
import { buildAlbumsMap, deleteLabels, mergeAlbumsRaw } from 'helpers'

const { USER_FOLLOW_READ } = Scope
const { ISO_DATE } = MomentFormat

/**
 * Limit maximum number of concurrent requests
 */
const REQUEST_WORKERS = 6

/**
 * Loading bar animation duration in milliseconds
 */
const LOADING_ANIMATION = 550

/**
 * How much percentage of overall progress is assigned to base sync when extra data fetch is enabled
 */
const BASE_SYNC_RATIO = 0.8

/**
 * Synchronization saga
 *
 * @param {SyncAction} action
 */
export function* syncSaga(action) {
  try {
    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(withTitle, 'Loading...', syncMainSaga, action)
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [USER_FOLLOW_READ], titled)

    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError && error.message))
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

  /** @type {Await<ReturnType<typeof getUser>>} */
  const user = yield call(getUser, token)
  /** @type {Await<ReturnType<typeof getUserFollowedArtists>>} */
  const artists = yield call(getUserFollowedArtists, token)

  /** @type {AlbumRaw[]} */
  const albumsRaw = []
  /** @type {Task[]} */
  const tasks = []
  /** @type {Progress} */
  const progress = { value: 0 }
  const minDate = moment().subtract(days, 'day').format(ISO_DATE)

  /** @type {RequestChannel} */
  const requestChannel = yield call(channel, buffers.expanding(artists.length))
  /** @type {ResponseChannel} */
  const responseChannel = yield call(channel, buffers.expanding(REQUEST_WORKERS))

  for (let i = 0; i < REQUEST_WORKERS; i += 1) {
    tasks.push(yield fork(requestWorker, requestChannel, responseChannel))
  }

  tasks.push(yield fork(progressWorker, progress, setSyncingProgress, LOADING_ANIMATION))

  yield call(syncBaseData, albumsRaw, artists, minDate, requestChannel, responseChannel, progress)

  /** @type {Await<ReturnType<typeof mergeAlbumsRaw>>} */
  const merged = yield call(mergeAlbumsRaw, albumsRaw, minDate)
  /** @type {Await<ReturnType<typeof buildAlbumsMap>>} */
  const albums = yield call(buildAlbumsMap, merged, artists)

  if (fullAlbumData) {
    yield call(syncExtraData, merged, albums, requestChannel, responseChannel, progress)
    yield call(deleteLabels, albums, labelBlocklist)
  }

  yield cancel(tasks)
  yield delay(LOADING_ANIMATION)
  yield put(syncFinished({ albums, user, previousSyncMaxDate, auto: action.payload?.auto }))
}

/**
 * Fetch base album data
 *
 * @param {AlbumRaw[]} albumsRaw
 * @param {Artist[]} artists
 * @param {string} minDate
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {Progress} progress
 */
function* syncBaseData(albumsRaw, artists, minDate, requestChannel, responseChannel, progress) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<typeof getSettings>} */
  const { groups, market, fullAlbumData } = yield select(getSettings)

  for (const artist of artists) {
    yield put(requestChannel, [getArtistAlbums, token, artist.id, groups, market, minDate])
  }

  for (let fetched = 0; fetched < artists.length; fetched += 1) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof getArtistAlbums>>>} */
    const response = yield take(responseChannel)

    let newProgress = ((fetched + 1) / artists.length) * 100
    if (fullAlbumData) newProgress *= BASE_SYNC_RATIO
    progress.value = newProgress

    if (response.error) continue

    albumsRaw.push(...response.result)
  }
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
  /** @type {ReturnType<typeof getSettings>} */
  const { market } = yield select(getSettings)

  const albumIds = albumsRaw.map((album) => album.id)
  const albumIdsChunks = chunk(albumIds, 20)

  for (const albumIdsChunk of albumIdsChunks) {
    yield put(requestChannel, [getFullAlbums, token, albumIdsChunk, market])
  }

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
