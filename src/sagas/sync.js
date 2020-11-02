import moment from 'moment'
import { channel, buffers } from 'redux-saga'
import { call, put, select, take, fork, cancel, delay } from 'redux-saga/effects'
import { getSettings, getToken, getReleasesMaxDate } from 'state/selectors'
import { MomentFormat } from 'enums'
import { getUser, getUserFollowedArtists, getArtistAlbums } from 'api'
import {
  setSyncingProgress,
  setUser,
  syncStart,
  syncFinished,
  syncError,
  setAlbums,
  showErrorMessage,
} from 'state/actions'

/**
 * @typedef {import('redux-saga').Channel} Channel
 * @typedef {import('redux-saga').Task} Task
 * @typedef {{ value: number }} Progress
 */

const REQUEST_WORKERS = 6
const PROGRESS_ANIMATION_MS = 550

/**
 * Saga that updates progress after each animation window
 *
 * @param {Progress} progress
 * @param {ActionCreator} setProgressAction
 */
function* progressWorker(progress, setProgressAction) {
  try {
    while (true) {
      yield put(setProgressAction(progress.value))
      yield delay(PROGRESS_ANIMATION_MS)
    }
  } finally {
    yield put(setProgressAction(progress.value))
  }
}

/**
 * Saga that takes http requests from `requestChannel` and sends responses to `responseChannel`
 *
 * @param {Channel} requestChannel
 * @param {Channel} responseChannel
 */
function* requestWorker(requestChannel, responseChannel) {
  while (true) {
    /** @type {[(...args: any[]) => any, ...any[]]} */
    const request = yield take(requestChannel)

    try {
      const result = yield call(...request)

      yield put(responseChannel, { result })
    } catch (error) {
      yield put(responseChannel, { error })
    }
  }
}

/**
 * Main synchronization saga
 */
export function* syncSaga() {
  try {
    yield put(syncStart())

    const token = yield select(getToken)
    const { groups, market, days } = yield select(getSettings)
    const previousSyncMaxDate = yield select(getReleasesMaxDate)

    const user = yield call(getUser, token)
    const artists = yield call(getUserFollowedArtists, token)

    /** @type {Album[]} */
    const albums = []
    /** @type {Task[]} */
    const tasks = []
    /** @type {Progress} */
    const progress = { value: 0 }
    const minDate = moment().subtract(days, 'day').format(MomentFormat.ISO_DATE)

    const requestChannel = yield call(channel, buffers.fixed(artists.length))
    const responseChannel = yield call(channel, buffers.fixed(REQUEST_WORKERS))

    for (let i = 0; i < REQUEST_WORKERS; i += 1) {
      tasks.push(yield fork(requestWorker, requestChannel, responseChannel))
    }

    tasks.push(yield fork(progressWorker, progress, setSyncingProgress))

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
    yield delay(PROGRESS_ANIMATION_MS)

    yield put(setUser(user))
    yield put(setAlbums(albums, artists, minDate))
    yield put(syncFinished(previousSyncMaxDate))
  } catch (error) {
    yield put(showErrorMessage())
    yield put(syncError())

    throw error
  }
}
