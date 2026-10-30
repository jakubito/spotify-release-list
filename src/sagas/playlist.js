import { call, delay, put, select } from 'redux-saga/effects'
import moment from 'moment'
import { getLastPlaylistsRefresh, getPlaylistForm, getPlaylists } from 'state/selectors'
import {
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  loadPlaylists,
  loadPlaylistsError,
  loadPlaylistsFinished,
  loadPlaylistsStart,
  showErrorMessage,
  updatePlaylistError,
  updatePlaylistFinished,
  updatePlaylistStart,
} from 'state/actions'
import { withTitle } from './helpers'

/**
 * Simulated request duration in milliseconds
 */
const REQUEST_DELAY = 1500

/** @type {Playlist[]} */
const DEMO_PLAYLISTS = [
  { id: '1234567890', name: 'New Releases' },
  { id: '2345678901', name: 'Weekly Picks' },
  { id: '3456789012', name: 'Chill Finds' },
]

/**
 * Playlist creation saga
 *
 * @param {CreatePlaylistAction} action
 */
export function* createPlaylistSaga(action) {
  try {
    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(withTitle, 'Creating playlist...', createPlaylistMainSaga)
    yield call(titled)
  } catch (error) {
    if (error instanceof Error) {
      yield put(showErrorMessage(error.message))
    }
    yield put(createPlaylistError())
  }
}

/**
 * Playlist creation main saga
 */
function* createPlaylistMainSaga() {
  yield put(createPlaylistStart())

  /** @type {ReturnType<typeof getPlaylistForm>} */
  const form = yield select(getPlaylistForm)

  yield delay(REQUEST_DELAY)
  yield put(createPlaylistFinished({ id: DEMO_PLAYLISTS[0].id, name: form.name ?? '' }))
}

/**
 * @param {UpdatePlaylistAction} action
 */
export function* updatePlaylistSaga(action) {
  try {
    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(withTitle, 'Updating playlist...', updatePlaylistMainSaga, action)
    yield call(titled)
  } catch (error) {
    if (error instanceof Error) {
      yield put(showErrorMessage(error.message))
    }
    yield put(updatePlaylistError())
  }
}

/**
 * @param {UpdatePlaylistAction} action
 */
function* updatePlaylistMainSaga(action) {
  yield put(updatePlaylistStart())
  yield delay(REQUEST_DELAY)
  yield put(updatePlaylistFinished(action.payload.playlist))
}

export function* refreshPlaylistsSaga() {
  /** @type {ReturnType<typeof getPlaylists>} */
  const playlists = yield select(getPlaylists)
  /** @type {ReturnType<typeof getLastPlaylistsRefresh>} */
  const lastRefresh = yield select(getLastPlaylistsRefresh)

  const shouldRefresh = () => {
    if (playlists.length === 0) return true
    if (!lastRefresh) return true
    if (moment(lastRefresh).isBefore(moment().subtract(1, 'hour'))) return true
    return false
  }

  if (shouldRefresh()) yield put(loadPlaylists())
}

/**
 * @param {LoadPlaylistsAction} action
 */
export function* loadPlaylistsSaga(action) {
  try {
    yield put(loadPlaylistsStart())
    yield delay(REQUEST_DELAY)
    yield put(loadPlaylistsFinished(DEMO_PLAYLISTS))
  } catch (error) {
    if (error instanceof Error) {
      yield put(showErrorMessage(error.message))
    }
    yield put(loadPlaylistsError())
  }
}
