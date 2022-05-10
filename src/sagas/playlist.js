import { call, delay, put } from 'redux-saga/effects'
import { AuthError } from 'auth'
import {
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  showErrorMessage,
} from 'state/actions'
import { withTitle } from './helpers'

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
    yield put(showErrorMessage(error instanceof AuthError && error.message))
    yield put(createPlaylistError())
  }
}

/**
 * Playlist creation main saga
 */
function* createPlaylistMainSaga() {
  yield put(createPlaylistStart())
  yield delay(1500)
  yield put(createPlaylistFinished({ id: '1234567890' }))
}
