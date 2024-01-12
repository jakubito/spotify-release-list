import { call, put, delay } from 'redux-saga/effects'
import { AuthError } from 'auth'
import {
  setSyncingProgress,
  showErrorMessage,
  syncCancel,
  syncError,
  syncStart,
} from 'state/actions'
import { withTitle } from './helpers'

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
    /** @type {ReturnType<typeof withTitle>} */
    const titled = yield call(withTitle, 'Loading...', syncMainSaga, action)
    yield call(titled)
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

  for (let i = 1; i <= 4; i++) {
    yield delay(LOADING_ANIMATION)
    yield put(setSyncingProgress(i * 25))
  }

  yield delay(LOADING_ANIMATION)
  yield put(syncCancel())
}
