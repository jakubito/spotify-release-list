import { fork, take, takeEvery, takeLeading } from 'redux-saga/effects'
import {
  HYDRATE,
  AUTHORIZE,
  AUTHORIZE_ERROR,
  SYNC,
  SYNC_CANCEL,
  CREATE_PLAYLIST,
  CREATE_PLAYLIST_CANCEL,
  SET_SETTINGS,
  RESET,
} from 'state/actions'
import { deleteAuthData } from 'auth'
import { takeLeadingCancellable } from './helpers'
import { themeUpdateSaga } from './theme'
import { authorizeErrorSaga, authorizeSaga } from './auth'
import { syncSaga } from './sync'
import { createPlaylistSaga } from './playlist'
import { autoSyncSaga } from './automation'
import { updateSaga } from './update'
import { notificationSaga } from './notification'

/**
 * Root saga
 */
export function* rootSaga() {
  yield take(HYDRATE)
  yield takeEvery(SET_SETTINGS, themeUpdateSaga)
  yield takeEvery(RESET, deleteAuthData)
  yield takeEvery(AUTHORIZE_ERROR, authorizeErrorSaga)
  yield takeLeading(AUTHORIZE, authorizeSaga)
  yield takeLeadingCancellable(SYNC, SYNC_CANCEL, syncSaga)
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga)
  yield fork(autoSyncSaga)

  if (navigator.serviceWorker) {
    yield fork(updateSaga)
  }

  if (window.Notification) {
    yield fork(notificationSaga)
  }
}

export default rootSaga
