import { call, fork, put, spawn, take, takeLeading } from 'redux-saga/effects'
import { triggerUpdate, updateReady } from 'state/actions'
import { serviceWorkerEventChannel, throttle, windowEventChannel } from './helpers'

/**
 * Main update saga
 */
export function* updateSaga() {
  yield takeLeading(triggerUpdate.type, update)
  yield fork(appFocusCheck)
  yield fork(waitingCheck)
}

/**
 * Trigger app update
 */
function* update() {
  const { serviceWorker } = navigator
  /** @type {Await<ReturnType<typeof serviceWorker.getRegistration>>} */
  const registration = yield call([serviceWorker, serviceWorker.getRegistration])
  const workerToActivate = registration?.waiting

  if (!workerToActivate) return

  /** @type {EventChannel<ServiceWorkerEventMap['statechange']>} */
  const stateChange = yield call(serviceWorkerEventChannel, workerToActivate, 'statechange')
  yield call([workerToActivate, workerToActivate.postMessage], { type: 'SKIP_WAITING' })

  while (workerToActivate.state !== 'activated') {
    yield take(stateChange)
  }

  yield call(stateChange.close)
  yield call([window.location, /** @type {Fn} */ (window.location.reload)])
}

/**
 * Check for updates on app focus
 */
function* appFocusCheck() {
  /** @type {EventChannel<WindowEventMap['focus']>} */
  const focus = yield call(windowEventChannel, 'focus')
  /** @type {ReturnType<typeof throttle>} */
  const updateCheckThrottled = yield call(throttle, 1, 'hour', updateCheck)
  /** @type {ReturnType<typeof throttle>} */
  const waitingCheckThrottled = yield call(throttle, 1, 'day', waitingCheck)

  while (true) {
    yield take(focus)
    yield call(updateCheckThrottled)
    yield call(waitingCheckThrottled)
  }
}

/**
 * Trigger service worker update
 */
function* updateCheck() {
  const { serviceWorker } = navigator
  /** @type {Await<ReturnType<typeof serviceWorker.getRegistration>>} */
  const registration = yield call([serviceWorker, serviceWorker.getRegistration])

  if (registration) {
    yield spawn([registration, registration.update])
  }
}

/**
 * Notify user about waiting update
 */
function* waitingCheck() {
  const { serviceWorker } = navigator
  /** @type {Await<ReturnType<typeof serviceWorker.getRegistration>>} */
  const registration = yield call([serviceWorker, serviceWorker.getRegistration])

  if (registration?.waiting) {
    yield put(updateReady())
  }
}
