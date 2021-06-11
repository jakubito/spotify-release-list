import * as Sentry from '@sentry/browser'
import { call, put, select } from 'redux-saga/effects'
import {
  AuthError,
  createCodeChallenge,
  exchangeCode,
  generateCodeVerifier,
  getRefreshedToken,
  startAuthFlow,
  validateAuthRequest,
} from 'auth'
import { persistor } from 'state'
import { getAuthData } from 'state/selectors'
import {
  authorizeStart,
  authorizeFinished,
  authorizeError,
  setAuthData,
  showErrorMessage,
} from 'state/actions'

/**
 * Authorization wrapper saga
 *
 * @param {ReturnType<import('state/actions').authorize>} action
 */
export function* authorizeSaga(action) {
  try {
    yield call(authorizeMainSaga, action)
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError ? error.message : undefined))
    yield put(authorizeError())
    Sentry.captureException(error)
  }
}

/**
 * Main authorization saga
 *
 * @param {ReturnType<import('state/actions').authorize>} action
 */
function* authorizeMainSaga({ payload }) {
  yield put(authorizeStart())

  /** @type {ReturnType<getAuthData>} */
  const { nonce, codeVerifier } = yield select(getAuthData)
  /** @type {ReturnType<validateAuthRequest>} */
  const { code, action } = yield call(validateAuthRequest, payload.locationSearch, nonce)
  /** @type {Await<ReturnType<exchangeCode>>} */
  const tokenResult = yield call(exchangeCode, code, codeVerifier)

  yield put(setAuthData(tokenResult))
  yield put(authorizeFinished())
  yield put(action)
}

/**
 * Ensure valid authorized state before running saga
 *
 * @param {Action} action
 * @param {string[]} scopes
 * @param {Fn} saga
 * @param {...any} args
 */
export function authorize(action, scopes, saga, ...args) {
  return function* () {
    try {
      yield put(authorizeStart())

      /** @type {ReturnType<getAuthData>} */
      const { tokenScope, refreshToken } = yield select(getAuthData)
      const validScope = scopes.every((scope) => tokenScope?.includes(scope))

      if (refreshToken && validScope) {
        yield call(refreshTokenAndRun, saga, ...args)
      } else {
        yield call(triggerNewAuthFlow, action, scopes.join(' '))
      }
    } catch (error) {
      yield put(authorizeError())
      Sentry.captureException(error)

      throw error
    }
  }
}

/**
 * Refresh token and call saga
 *
 * @param {Fn} saga
 * @param {...any} args
 */
function* refreshTokenAndRun(saga, ...args) {
  /** @type {ReturnType<getAuthData>} */
  const { refreshToken } = yield select(getAuthData)
  /** @type {Await<ReturnType<getRefreshedToken>>} */
  const tokenResult = yield call(getRefreshedToken, refreshToken)

  yield put(setAuthData(tokenResult))
  yield put(authorizeFinished())
  yield call(saga, ...args)
}

/**
 * Trigger new authorization flow
 *
 * @param {Action} action
 * @param {string} scope
 */
function* triggerNewAuthFlow(action, scope) {
  /** @type {ReturnType<generateCodeVerifier>} */
  const nonce = yield call(generateCodeVerifier, 20)
  /** @type {ReturnType<generateCodeVerifier>} */
  const codeVerifier = yield call(generateCodeVerifier)
  /** @type {Await<ReturnType<createCodeChallenge>>} */
  const codeChallenge = yield call(createCodeChallenge, codeVerifier)

  yield put(setAuthData({ nonce, codeVerifier }))
  yield call(persistor.flush)
  yield call(startAuthFlow, action, scope, codeChallenge, nonce)
}
