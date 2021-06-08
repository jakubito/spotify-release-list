import moment from 'moment'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, delay } from 'redux-saga/effects'
import { MomentFormat, Scope } from 'enums'
import { getUser, getUserFollowedArtists, getArtistAlbums } from 'api'
import { AuthError } from 'auth'
import { getAuthData, getSettings, getReleasesMaxDate } from 'state/selectors'
import {
  setSyncingProgress,
  setUser,
  sync,
  syncStart,
  syncFinished,
  syncError,
  setAlbums,
  showErrorMessage,
} from 'state/actions'
import { authorized } from './auth'
import { progressWorker, requestWorker } from './helpers'

const { USER_FOLLOW_READ } = Scope
const { ISO_DATE } = MomentFormat

/**
 * Limit maximum number of concurrent requests
 */
const REQUEST_WORKERS = 6

/**
 * Loading bar animation duration in miliseconds
 */
const LOADING_ANIMATION_MS = 550

/**
 * Synchronization wrapper saga
 */
export function* syncSaga() {
  try {
    yield call(authorized, syncMainSaga, sync(), [USER_FOLLOW_READ])
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError ? error.message : undefined))
    yield put(syncError())
  }
}

/**
 * Main synchronization saga
 */
function* syncMainSaga() {
  yield put(syncStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield select(getAuthData)
  /** @type {ReturnType<typeof getSettings>} */
  const { groups, market, days } = yield select(getSettings)
  /** @type {ReturnType<typeof getReleasesMaxDate>} */
  const previousSyncMaxDate = yield select(getReleasesMaxDate)

  /** @type {Await<ReturnType<typeof getUser>>} */
  const user = yield call(getUser, token)
  /** @type {Await<ReturnType<typeof getUserFollowedArtists>>} */
  const artists = yield call(getUserFollowedArtists, token)

  /** @type {AlbumRaw[]} */
  const albums = []
  /** @type {Task[]} */
  const tasks = []
  /** @type {Progress} */
  const progress = { value: 0 }
  const minDate = moment().subtract(days, 'day').format(ISO_DATE)

  const requestChannel = yield call(channel, buffers.fixed(artists.length))
  const responseChannel = yield call(channel, buffers.fixed(REQUEST_WORKERS))

  for (let i = 0; i < REQUEST_WORKERS; i += 1) {
    tasks.push(yield fork(requestWorker, requestChannel, responseChannel))
  }

  tasks.push(yield fork(progressWorker, progress, setSyncingProgress, LOADING_ANIMATION_MS))

  for (const artist of artists) {
    yield put(requestChannel, [getArtistAlbums, token, artist.id, groups, market, minDate])
  }

  for (let fetched = 0; fetched < artists.length; fetched += 1) {
    const response = yield take(responseChannel)

    if (response.result) {
      albums.push(...response.result)
    }

    progress.value = ((fetched + 1) / artists.length) * 100
  }

  yield cancel(tasks)
  yield delay(LOADING_ANIMATION_MS)

  yield put(setUser(user))
  yield put(setAlbums(albums, artists, minDate))
  yield put(syncFinished(previousSyncMaxDate))
}
