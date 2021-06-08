import { call, cancel, delay, fork, put, race, take } from 'redux-saga/effects'

/**
 * Behaves the same way as redux-saga's `takeLeading` but also can be cancelled
 *
 * @param {string} triggerAction
 * @param {string} cancelAction
 * @param {Fn} saga
 * @param {...any} args
 */
export function takeLeadingCancellable(triggerAction, cancelAction, saga, ...args) {
  return fork(function* () {
    while (true) {
      const action = yield take(triggerAction)
      const task = yield fork(saga, ...args.concat(action))
      const [cancelled] = yield race([take(cancelAction), call(task.toPromise)])

      if (cancelled) {
        yield cancel(task)
      }
    }
  })
}

/**
 * Saga that updates progress after each animation window
 *
 * @param {Progress} progress
 * @param {ActionCreator} setProgressAction
 * @param {number} updateInterval - How often to dispatch progress value (milliseconds)
 */
export function* progressWorker(progress, setProgressAction, updateInterval) {
  try {
    while (true) {
      yield put(setProgressAction(progress.value))
      yield delay(updateInterval)
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
export function* requestWorker(requestChannel, responseChannel) {
  while (true) {
    /** @type {[Fn, ...any[]]} */
    const request = yield take(requestChannel)

    try {
      const result = yield call(...request)
      yield put(responseChannel, { result })
    } catch (error) {
      console.error(error)
      yield put(responseChannel, { error })
    }
  }
}
