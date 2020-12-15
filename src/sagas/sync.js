import moment from 'moment'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, delay } from 'redux-saga/effects'
import { MomentFormat } from 'enums'
import { getUser, getUserFollowedArtists, getArtistAlbums } from 'api'
import { isValidSyncToken, startSyncAuthFlow } from 'auth'
import { getSettings, getToken, getReleasesMaxDate } from 'state/selectors'
import {
  setSyncingProgress,
  setUser,
  syncStart,
  syncFinished,
  syncError,
  setAlbums,
  showErrorMessage,
} from 'state/actions'
import { progressWorker, requestWorker, withValidToken } from './helpers'

const { ISO_DATE } = MomentFormat

/**
 * Limit maximum number of concurrent requests
 */
const REQUEST_WORKERS = 6

/**
 * Loading animation duration in miliseconds
 */
const LOADING_ANIMATION_MS = 550

/**
 * Synchronization wrapper saga
 */
function* syncSaga() {
  yield call(withValidToken, syncMainSaga, isValidSyncToken, startSyncAuthFlow)
}

/**
 * Main synchronization saga
 */
function* syncMainSaga() {
  try {
    yield put(syncStart())

    /** @type {ReturnType<typeof getToken>} */
    const token = yield select(getToken)
    /** @type {ReturnType<typeof getSettings>} */
    const { groups, market, days } = yield select(getSettings)
    /** @type {ReturnType<typeof getReleasesMaxDate>} */
    const previousSyncMaxDate = yield select(getReleasesMaxDate)

    /** @type {Await<ReturnType<typeof getUser>>} */
    const user = yield call(getUser, token)
    /** @type {Await<ReturnType<typeof getUserFollowedArtists>>} */
    const artists = yield call(getUserFollowedArtists, token)

    /** @type {Album[]} */
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
  } catch (error) {
    yield put(showErrorMessage())
    yield put(syncError())

    throw error
  }
}

export default syncSaga
