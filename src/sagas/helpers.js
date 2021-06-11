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
 * Replace document title for the duration of saga
 *
 * @param {string} title
 * @param {Fn} saga
 * @param {...any} args
 */
export function withTitle(title, saga, ...args) {
  return function* () {
    const originalTitle = document.title

    try {
      document.title = title
      yield call(saga, ...args)
    } finally {
      document.title = originalTitle
    }
  }
}

/**
 * Worker saga that dispatches progress value to the store at specific interval
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
 * Worker saga that fulfills requests stored in the queue until manually stopped
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
