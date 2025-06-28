import { call, put, takeLeading } from 'redux-saga/effects'
import { Scope } from 'enums'
import { followArtists as followArtistsApi, unfollowArtists as unfollowArtistsApi } from 'api'
import { getAuthData } from 'auth'
import {
  followArtists,
  followArtistsStart,
  followArtistsFinished,
  followArtistsError,
  unfollowArtists,
  unfollowArtistsStart,
  unfollowArtistsFinished,
  unfollowArtistsError,
  addArtistsToBlocklist,
  removeArtistsFromBlocklist,
  showErrorMessage,
  showMessage,
  applyLabelBlocklist,
} from 'state/actions'
import { authorize } from './auth'

/**
 * Main artist management saga
 */
export function* artistManagementSaga() {
  yield takeLeading(followArtists.type, followArtistsSaga)
  yield takeLeading(unfollowArtists.type, unfollowArtistsSaga)
  yield takeLeading(addArtistsToBlocklist.type, addArtistsToBlocklistSaga)
  yield takeLeading(removeArtistsFromBlocklist.type, removeArtistsFromBlocklistSaga)
}

/**
 * Follow artists saga
 *
 * @param {ReturnType<typeof followArtists>} action
 */
function* followArtistsSaga(action) {
  try {
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [Scope.USER_FOLLOW_MODIFY], followArtistsMainSaga, action.payload)
    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(followArtistsError())
  }
}

/**
 * Main follow artists saga
 *
 * @param {string[]} artistIds
 */
function* followArtistsMainSaga(artistIds) {
  yield put(followArtistsStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)

  // Spotify API allows up to 50 artists per request
  const chunks = []
  for (let i = 0; i < artistIds.length; i += 50) {
    chunks.push(artistIds.slice(i, i + 50))
  }

  for (const chunk of chunks) {
    yield call(followArtistsApi, token, chunk)
  }

  yield put(followArtistsFinished(artistIds))
  yield put(showMessage(`Successfully followed ${artistIds.length} artist${artistIds.length > 1 ? 's' : ''}`))
}

/**
 * Unfollow artists saga
 *
 * @param {ReturnType<typeof unfollowArtists>} action
 */
function* unfollowArtistsSaga(action) {
  try {
    /** @type {ReturnType<typeof authorize>} */
    const authorized = yield call(authorize, action, [Scope.USER_FOLLOW_MODIFY], unfollowArtistsMainSaga, action.payload)
    yield call(authorized)
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
    yield put(unfollowArtistsError())
  }
}

/**
 * Main unfollow artists saga
 *
 * @param {string[]} artistIds
 */
function* unfollowArtistsMainSaga(artistIds) {
  yield put(unfollowArtistsStart())

  /** @type {ReturnType<typeof getAuthData>} */
  const { token } = yield call(getAuthData)

  // Spotify API allows up to 50 artists per request
  const chunks = []
  for (let i = 0; i < artistIds.length; i += 50) {
    chunks.push(artistIds.slice(i, i + 50))
  }

  for (const chunk of chunks) {
    yield call(unfollowArtistsApi, token, chunk)
  }

  yield put(unfollowArtistsFinished(artistIds))
  yield put(showMessage(`Successfully unfollowed ${artistIds.length} artist${artistIds.length > 1 ? 's' : ''}`))
}

/**
 * Add artists to blocklist saga
 *
 * @param {ReturnType<typeof addArtistsToBlocklist>} action
 */
function* addArtistsToBlocklistSaga(action) {
  try {
    // The action is already handled by the reducer, just apply the blocklist
    yield put(applyLabelBlocklist())
    yield put(showMessage(`Added ${action.payload.length} artist${action.payload.length > 1 ? 's' : ''} to blocklist`))
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
  }
}

/**
 * Remove artists from blocklist saga
 *
 * @param {ReturnType<typeof removeArtistsFromBlocklist>} action
 */
function* removeArtistsFromBlocklistSaga(action) {
  try {
    // The action is already handled by the reducer, just apply the blocklist
    yield put(applyLabelBlocklist())
    yield put(showMessage(`Removed ${action.payload.length} artist${action.payload.length > 1 ? 's' : ''} from blocklist`))
  } catch (error) {
    yield put(showErrorMessage(error.message ?? error.toString()))
  }
}