import { channel, buffers } from 'redux-saga'
import { call, put, take, delay, fork, cancelled } from 'redux-saga/effects'
import { FetchError } from 'api'
import { getAuthData } from 'auth'

/**
 * Limit maximum number of concurrent requests
 */
const DEFAULT_WORKERS_COUNT = 8

/**
 * @param {number} count
 */
export function setupWorkers(count = DEFAULT_WORKERS_COUNT) {
  /** @type {Task[]} */
  const workers = []
  /** @type {RequestChannel} */
  const requestChannel = channel(buffers.expanding(1000))
  /** @type {ResponseChannel} */
  const responseChannel = channel(buffers.expanding(count))

  const workersFork = function* () {
    for (let i = 0; i < count; i++)
      workers.push(yield fork(requestWorker, requestChannel, responseChannel, 4, 4000))
  }

  return { workers, requestChannel, responseChannel, workersFork }
}

/**
 * @param {RequestChannel} requestChannel
 * @param {RequestChannelMessagePayload} payload
 */
export function* putRequestMessage(requestChannel, payload) {
  yield put(requestChannel, { payload, callCount: 0 })
}

/**
 * Worker saga that fulfills requests stored in the queue until manually stopped
 *
 * @template T
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel<T>} responseChannel
 * @param {number} [retryLimit]
 * @param {number} [retryDelay]
 */
function* requestWorker(requestChannel, responseChannel, retryLimit = 2, retryDelay = 5000) {
  const abortController = new AbortController()

  try {
    while (true) {
      /** @type {RequestChannelMessage} */
      const request = yield take(requestChannel)

      try {
        const result = yield call(...request.payload, abortController.signal)
        yield put(responseChannel, { result, requestPayload: request.payload })
      } catch (error) {
        console.error(error)
        if (error instanceof FetchError) {
          if (request.callCount < retryLimit) {
            yield delay(retryDelay)
            yield put(requestChannel, request)
          } else {
            yield put(responseChannel, { error, requestPayload: request.payload })
          }
        } else {
          throw error
        }
      } finally {
        request.callCount++
      }
    }
  } finally {
    if (yield cancelled()) abortController.abort()
  }
}

/**
 * @template T
 * @param {CursorPagedRequest<T>} requestFn
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 */
export function* getAllCursorPaged(requestFn, requestChannel, responseChannel) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)
  /** @type {T[]} */
  const items = []
  const limit = 50
  let workerActive = true

  yield putRequestMessage(requestChannel, [requestFn, token, limit, null])

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
 * @param {PagedRequest<T>} requestFn
 * @param {RequestChannel} requestChannel
 * @param {ResponseChannel} responseChannel
 * @param {number} workersCount
 */
export function* getAllPaged(requestFn, requestChannel, responseChannel, workersCount) {
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
    const { result, requestPayload } = yield take(responseChannel)

    if (result) {
      /** @type {number} */
      const resultOffset = requestPayload[3]

      for (let i = 0; i < result.items.length; i++) {
        items[resultOffset + i] = result.items[i]
      }

      if (offset > result.total) {
        activeWorkers--
        continue
      }
    }

    yield putRequestMessage(requestChannel, [requestFn, token, limit, offset])
    offset += limit
  }

  return items.filter(Boolean)
}
