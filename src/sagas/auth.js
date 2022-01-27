import { call, put } from 'redux-saga/effects'
import { captureException } from 'helpers'
import {
  AuthError,
  createCodeChallenge,
  deleteAuthData,
  exchangeCode,
  generateCodeVerifier,
  getAuthData,
  getRefreshedToken,
  setAuthData,
  startAuthFlow,
  validateAuthRequest,
} from 'auth'
import { authorizeStart, authorizeFinished, authorizeError, showErrorMessage } from 'state/actions'

/**
 * Authorization wrapper saga
 *
 * @param {AuthorizeAction} action
 */
export function* authorizeSaga(action) {
  try {
    yield call(authorizeMainSaga, action)
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError && error.message))
    yield put(authorizeError({ resetAuthData: error instanceof AuthError }))
    yield call(captureException, error)
  }
}

/**
 * Main authorization saga
 *
 * @param {AuthorizeAction} authorizeAction
 */
function* authorizeMainSaga({ payload }) {
  yield put(authorizeStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { nonce, codeVerifier } = yield call(getAuthData)
  /** @type {ReturnType<typeof validateAuthRequest>} */
  const { code, action } = yield call(validateAuthRequest, payload.locationSearch, nonce)
  /** @type {Await<ReturnType<typeof exchangeCode>>} */
  const tokenResult = yield call(exchangeCode, code, codeVerifier)

  yield call(setAuthData, tokenResult)
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

      /** @type {ReturnType<typeof getAuthData>} */
      const { tokenScope, refreshToken } = yield call(getAuthData)
      const validScope = scopes.every((scope) => tokenScope?.includes(scope))

      if (refreshToken && validScope) {
        yield call(refreshTokenAndRun, saga, ...args)
      } else {
        yield call(triggerNewAuthFlow, action, scopes.join(' '))
      }
    } catch (error) {
      yield put(authorizeError({ resetAuthData: error instanceof AuthError }))
      yield call(captureException, error)

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
  /** @type {ReturnType<typeof getAuthData>} */
  const { refreshToken } = yield call(getAuthData)
  /** @type {Await<ReturnType<typeof getRefreshedToken>>} */
  const tokenResult = yield call(getRefreshedToken, refreshToken)

  yield call(setAuthData, tokenResult)
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
  /** @type {ReturnType<typeof generateCodeVerifier>} */
  const nonce = yield call(generateCodeVerifier, 20)
  /** @type {ReturnType<typeof generateCodeVerifier>} */
  const codeVerifier = yield call(generateCodeVerifier)
  /** @type {Await<ReturnType<typeof createCodeChallenge>>} */
  const codeChallenge = yield call(createCodeChallenge, codeVerifier)

  yield call(setAuthData, { nonce, codeVerifier })
  yield call(startAuthFlow, action, scope, codeChallenge, nonce)
}

/**
 * Clear auth data on error
 *
 * @param {AuthorizeErrorAction} action
 */
export function* authorizeErrorSaga(action) {
  if (action.payload?.resetAuthData) {
    yield call(deleteAuthData)
  }
}
