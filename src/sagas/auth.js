import { call, fork, put, take } from 'redux-saga/effects'
import { navigate } from '@reach/router'
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
import {
  authorizeStart,
  authorizeFinished,
  authorizeError,
  showErrorMessage,
  SYNC_START,
  CREATE_PLAYLIST_START,
  AUTHORIZE_ERROR,
} from 'state/actions'

/**
 * Authorization wrapper saga
 *
 * @param {AuthorizeAction} action
 */
export function* authorizeSaga(action) {
  try {
    yield fork(redirectWhenReady)
    yield call(authorizeMainSaga, action)
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError ? error.message : undefined))
    yield put(authorizeError(error instanceof AuthError))
    yield call(captureException, error)
  }
}

/**
 * Redirect to root after action has started or authorization error is encountered
 */
function* redirectWhenReady() {
  yield take([SYNC_START, CREATE_PLAYLIST_START, AUTHORIZE_ERROR])
  yield call(/** @type {Navigate} */ (navigate), '/')
}

/**
 * Main authorization saga
 *
 * @param {AuthorizeAction} authorizeAction
 */
function* authorizeMainSaga({ payload }) {
  yield put(authorizeStart())

  /** @type {ReturnType<getAuthData>} */
  const { nonce, codeVerifier } = yield call(getAuthData)
  /** @type {ReturnType<validateAuthRequest>} */
  const { code, action } = yield call(validateAuthRequest, payload.locationSearch, nonce)
  /** @type {Await<ReturnType<exchangeCode>>} */
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

      /** @type {ReturnType<getAuthData>} */
      const { tokenScope, refreshToken } = yield call(getAuthData)
      const validScope = scopes.every((scope) => tokenScope?.includes(scope))

      if (refreshToken && validScope) {
        yield call(refreshTokenAndRun, saga, ...args)
      } else {
        yield call(triggerNewAuthFlow, action, scopes.join(' '))
      }
    } catch (error) {
      yield put(authorizeError(error instanceof AuthError))
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
  /** @type {ReturnType<getAuthData>} */
  const { refreshToken } = yield call(getAuthData)
  /** @type {Await<ReturnType<getRefreshedToken>>} */
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
  /** @type {ReturnType<generateCodeVerifier>} */
  const nonce = yield call(generateCodeVerifier, 20)
  /** @type {ReturnType<generateCodeVerifier>} */
  const codeVerifier = yield call(generateCodeVerifier)
  /** @type {Await<ReturnType<createCodeChallenge>>} */
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
  if (action.payload.resetAuthData) {
    yield call(deleteAuthData)
  }
}
