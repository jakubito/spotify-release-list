import moment from 'moment'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, delay } from 'redux-saga/effects'
import { MomentFormat, Scope } from 'enums'
import { getUser, getUserFollowedArtists, getArtistAlbums } from 'api'
import { AuthError, getAuthData } from 'auth'
import { getSettings, getReleasesMaxDate } from 'state/selectors'
import {
  saveAlbums,
  setSyncingProgress,
  setUser,
  showErrorMessage,
  syncError,
  syncFinished,
  syncStart,
} from 'state/actions'
import { authorize } from './auth'
import { withTitle, progressWorker, requestWorker } from './helpers'

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
 * Synchronization saga
 *
 * @param {SyncAction} action
 */
export function* syncSaga(action) {
  try {
    /** @type {ReturnType<withTitle>} */
    const titled = yield call(withTitle, 'Loading...', syncMainSaga, action)
    /** @type {ReturnType<authorize>} */
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

  /** @type {ReturnType<getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {ReturnType<getSettings>} */
  const { groups, market, days } = yield select(getSettings)
  /** @type {ReturnType<getReleasesMaxDate>} */
  const previousSyncMaxDate = yield select(getReleasesMaxDate)

  /** @type {Await<ReturnType<getUser>>} */
  const user = yield call(getUser, token)
  /** @type {Await<ReturnType<getUserFollowedArtists>>} */
  const artists = yield call(getUserFollowedArtists, token)

  /** @type {AlbumRaw[]} */
  const albums = []
  /** @type {Task[]} */
  const tasks = []
  /** @type {Progress} */
  const progress = { value: 0 }
  const minDate = moment().subtract(days, 'day').format(ISO_DATE)

  /** @type {RequestChannel} */
  const requestChannel = yield call(channel, buffers.fixed(artists.length))
  /** @type {ResponseChannel<Await<ReturnType<getArtistAlbums>>>} */
  const responseChannel = yield call(channel, buffers.fixed(REQUEST_WORKERS))

  for (let i = 0; i < REQUEST_WORKERS; i += 1) {
    tasks.push(yield fork(requestWorker, requestChannel, responseChannel))
  }

  tasks.push(yield fork(progressWorker, progress, setSyncingProgress, LOADING_ANIMATION))

  for (const artist of artists) {
    yield put(requestChannel, [getArtistAlbums, token, artist.id, groups, market, minDate])
  }

  for (let fetched = 0; fetched < artists.length; fetched += 1) {
    /** @type {ResponseChannelMessage<Await<ReturnType<getArtistAlbums>>>} */
    const response = yield take(responseChannel)

    if (response.result) {
      albums.push(...response.result)
    }

    progress.value = ((fetched + 1) / artists.length) * 100
  }

  yield cancel(tasks)
  yield delay(LOADING_ANIMATION)

  yield put(setUser(user))
  yield put(saveAlbums({ artists, minDate, albumsRaw: albums }))
  yield put(syncFinished({ previousSyncMaxDate, auto: action.payload?.auto }))
}
