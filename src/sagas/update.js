import { call, fork, put, spawn, take, takeLeading } from 'redux-saga/effects'
import { TRIGGER_UPDATE, updateReady } from 'state/actions'
import { serviceWorkerEventChannel, throttle, windowEventChannel } from './helpers'

/**
 * Main update saga
 */
export function* updateSaga() {
  yield takeLeading(TRIGGER_UPDATE, update)
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

  while (true) {
    yield take(stateChange)
    if (workerToActivate.state === 'activated') break
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
  /** @type {ReturnType<throttle>} */
  const updateCheckThrottled = yield call(throttle, 1, 'hour', updateCheck)
  /** @type {ReturnType<throttle>} */
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
