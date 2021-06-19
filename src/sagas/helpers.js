import { eventChannel } from 'redux-saga'
import { call, delay, fork, put, race, take } from 'redux-saga/effects'
import moment from 'moment'

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
      yield race([call(saga, ...args.concat(action)), take(cancelAction)])
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
 * Throttle saga execution
 *
 * @param {import('moment').DurationInputArg1} amount
 * @param {import('moment').DurationInputArg2} unit
 * @param {Fn} saga
 * @param  {...any} args
 */
export function throttle(amount, unit, saga, ...args) {
  /** @type {Moment} */
  let lastRun

  return function* () {
    if (lastRun?.isAfter(moment().subtract(amount, unit))) return

    yield call(saga, ...args)
    lastRun = moment()
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
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel<any>} responseChannel
 */
export function* requestWorker(requestChannel, responseChannel) {
  while (true) {
    /** @type {RequestChannelMessage} */
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

/**
 * Window event listener transformed into channel
 *
 * @template {keyof WindowEventMap} T
 * @param {T} event
 * @returns {EventChannel<WindowEventMap[T]>}
 */
export function windowEventChannel(event) {
  return eventChannel((emitter) => {
    window.addEventListener(event, emitter)

    return () => {
      window.removeEventListener(event, emitter)
    }
  })
}
