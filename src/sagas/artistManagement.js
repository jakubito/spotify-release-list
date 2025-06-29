import { call, put, takeLeading } from 'redux-saga/effects'
import { Scope } from 'enums'
import { unfollowArtists as unfollowArtistsApi } from 'api'
import { getAuthData } from 'auth'
import {
  unfollowArtists,
  unfollowArtistsStart,
  unfollowArtistsFinished,
  unfollowArtistsError,
  showErrorMessage,
  showMessage,
} from 'state/actions'
import { authorize } from './auth'

/**
 * Main artist management saga
 */
export function* artistManagementSaga() {
  yield takeLeading(unfollowArtists.type, unfollowArtistsSaga)
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