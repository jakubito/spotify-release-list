import { eventChannel } from 'redux-saga'
import { call, delay, fork, put, race, take } from 'redux-saga/effects'
import moment from 'moment'
import { FetchError } from 'api'
import { getAuthData } from 'auth'

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
 * @param {ActionCreatorWithPayload<number>} setProgressAction
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
 * @template T
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel<T>} responseChannel
 * @param {number} [retryLimit]
 */
export function* requestWorker(requestChannel, responseChannel, retryLimit = 2) {
  while (true) {
    /** @type {RequestChannelMessage} */
    const request = yield take(requestChannel)

    try {
      const result = yield call(...request.payload)
      yield put(responseChannel, { result })
    } catch (error) {
      console.error(error)
      if (error instanceof FetchError && request.callCount < retryLimit) {
        yield delay(5000)
        yield put(requestChannel, request)
      } else {
        yield put(responseChannel, { error })
      }
    } finally {
      request.callCount++
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

/**
 * Service worker event listener transformed into channel
 *
 * @template {keyof ServiceWorkerEventMap} T
 * @param {ServiceWorker} serviceWorker
 * @param {T} event
 * @returns {EventChannel<ServiceWorkerEventMap[T]>}
 */
export function serviceWorkerEventChannel(serviceWorker, event) {
  return eventChannel((emitter) => {
    serviceWorker.addEventListener(event, emitter)

    return () => {
      serviceWorker.removeEventListener(event, emitter)
    }
  })
}

/**
 * @param {RequestChannel} requestChannel
 * @param {RequestChannelMessagePayload} payload
 */
export function* putRequestMessage(requestChannel, payload) {
  yield put(requestChannel, { payload, callCount: 0 })
}

/**
 * @template T
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {CursorPagedRequest<T>} requestFn
 */
export function* getAllCursorPaged(requestChannel, responseChannel, requestFn) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {T[]} */
  const items = []
  const limit = 50
  let workerActive = true

  yield putRequestMessage(requestChannel, [requestFn, token, limit])

  while (workerActive) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof requestFn>>>} */
    const { result } = yield take(responseChannel)

    if (result) {
      for (const item of result.items) items.push(item)
      if (result.cursors.after) {
        yield putRequestMessage(requestChannel, [requestFn, token, limit, result.cursors.after])
        continue
      }
    }

    workerActive = false
  }

  return items
}

/**
 * @template T
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {number} workersCount
 * @param {PagedRequest<T>} requestFn
 */
export function* getAllPaged(requestChannel, responseChannel, workersCount, requestFn) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {T[]} */
  const items = []
  const limit = 50
  let activeWorkers = workersCount
  let offset = 0

  for (let i = 0; i < workersCount; i++) {
    yield putRequestMessage(requestChannel, [requestFn, token, limit, offset])
    offset += limit
  }

  while (activeWorkers > 0) {
    /** @type {ResponseChannelMessage<Await<ReturnType<typeof requestFn>>>} */
    const { result } = yield take(responseChannel)

    if (result) {
      for (const item of result.items) items.push(item)
      if (offset > result.total) {
        activeWorkers--
        continue
      }
    }

    yield putRequestMessage(requestChannel, [requestFn, token, limit, offset])
    offset += limit
  }

  return items
}
