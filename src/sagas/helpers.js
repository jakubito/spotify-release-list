import { call, cancel, delay, fork, put, race, select, take } from 'redux-saga/effects'
import { generateNonce } from 'helpers'
import { persistor } from 'state'
import { getToken, getTokenExpires, getTokenScope } from 'state/selectors'
import { setNonce } from 'state/actions'

/**
 * Behaves the same way as redux-saga's `takeLeading` but can be cancelled
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
 * Validates token before running a saga and triggers authentication if needed
 *
 * @template {any[]} T
 * @param {Fn} saga
 * @param {(token: string, tokenExpires: string, tokenScope: string, ...args: T) => boolean } isValidToken
 * @param {(nonce: string, ...args: T) => void} startAuthFlow
 * @param {T} args
 */
export function* withValidToken(saga, isValidToken, startAuthFlow, ...args) {
  const token = yield select(getToken)
  const tokenExpires = yield select(getTokenExpires)
  const tokenScope = yield select(getTokenScope)
  const valid = yield call(isValidToken, token, tokenExpires, tokenScope, ...args)

  if (valid) {
    yield call(saga)
  } else {
    const nonce = yield call(generateNonce)

    yield put(setNonce(nonce))
    yield call(persistor.flush)
    yield call(startAuthFlow, nonce, ...args)
  }
}

/**
 * Saga that updates progress after each animation window
 *
 * @param {Progress} progress
 * @param {ActionCreator} setProgressAction
 * @param {number} animationDuration
 */
export function* progressWorker(progress, setProgressAction, animationDuration) {
  try {
    while (true) {
      yield put(setProgressAction(progress.value))
      yield delay(animationDuration)
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
      yield put(responseChannel, { error })
    }
  }
}
