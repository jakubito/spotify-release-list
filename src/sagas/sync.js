import { call, put, fork, cancel, delay } from 'redux-saga/effects'
import { AuthError } from 'auth'
import {
  setSyncingProgress,
  showErrorMessage,
  syncCancel,
  syncError,
  syncStart,
} from 'state/actions'
import { withTitle, progressWorker } from './helpers'

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

  /** @type {Task[]} */
  const tasks = []
  /** @type {Progress} */
  const progress = { value: 0 }

  tasks.push(yield fork(progressWorker, progress, setSyncingProgress, LOADING_ANIMATION))

  for (let i = 1; i <= 5; i++) {
    yield delay(LOADING_ANIMATION)
    progress.value = i * 20
  }

  yield cancel(tasks)
  yield delay(LOADING_ANIMATION)
  yield put(syncCancel())
}
