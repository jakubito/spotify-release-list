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
 * @param {ReturnType<typeof import('state/actions').authorize>} authorizeAction
 */
export function* authorizeSaga({ payload }) {
  try {
    yield call(authorizeMainSaga, payload.locationSearch)
  } catch (error) {
    yield put(showErrorMessage(error instanceof AuthError ? error.message : undefined))
    yield put(authorizeError())
  }
}

/**
 * Main authorization saga
 *
 * @param {string} locationSearch
 */
function* authorizeMainSaga(locationSearch) {
  yield put(authorizeStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { nonce } = yield select(getAuthData)
  /** @type {ReturnType<typeof validateAuthRequest>} */
  const { code, action } = yield call(validateAuthRequest, locationSearch, nonce)
  /** @type {ReturnType<typeof getAuthData>} */
  const { codeVerifier } = yield select(getAuthData)
  /** @type {Await<ReturnType<typeof exchangeCode>>} */
  const tokenResult = yield call(exchangeCode, code, codeVerifier)

  yield put(setAuthData(tokenResult))
  yield put(authorizeFinished())
  yield put(action)
}

/**
 * Ensure valid authorized state before running saga
 *
 * @param {Fn} saga
 * @param {Action} action
 * @param {string[]} scopes
 */
export function* authorized(saga, action, scopes) {
  try {
    yield put(authorizeStart())

    /** @type {ReturnType<typeof getAuthData>} */
    const { tokenScope, refreshToken } = yield select(getAuthData)
    const validScope = scopes.every((scope) => tokenScope?.includes(scope))

    if (refreshToken && validScope) {
      yield call(refreshSaga, saga)
    } else {
      yield call(newAuthSaga, action, scopes.join(' '))
    }
  } catch (error) {
    yield put(authorizeError())
    throw error
  }
}

/**
 * Refresh token and call saga
 *
 * @param {Fn} saga
 */
function* refreshSaga(saga) {
  /** @type {ReturnType<typeof getAuthData>} */
  const { refreshToken } = yield select(getAuthData)
  /** @type {Await<ReturnType<typeof getRefreshedToken>>} */
  const tokenResult = yield call(getRefreshedToken, refreshToken)

  yield put(setAuthData(tokenResult))
  yield put(authorizeFinished())
  yield call(saga)
}

/**
 * Start new authorization flow
 *
 * @param {Action} action
 * @param {string} scope
 */
function* newAuthSaga(action, scope) {
  /** @type {ReturnType<typeof generateCodeVerifier>} */
  const nonce = yield call(generateCodeVerifier, 20)
  /** @type {ReturnType<typeof generateCodeVerifier>} */
  const codeVerifier = yield call(generateCodeVerifier)
  /** @type {Await<ReturnType<typeof createCodeChallenge>>} */
  const codeChallenge = yield call(createCodeChallenge, codeVerifier)

  yield put(setAuthData({ nonce, codeVerifier }))
  yield call(persistor.flush)
  yield call(startAuthFlow, action, scope, codeChallenge, nonce)
}
