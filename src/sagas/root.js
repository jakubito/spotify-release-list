import { fork, take, takeEvery, takeLeading } from 'redux-saga/effects'
import {
  HYDRATE,
  AUTHORIZE,
  SYNC,
  SYNC_CANCEL,
  CREATE_PLAYLIST,
  CREATE_PLAYLIST_CANCEL,
  SET_SETTINGS,
} from 'state/actions'
import { takeLeadingCancellable } from './helpers'
import { themeUpdateSaga } from './theme'
import { authorizeSaga } from './auth'
import { syncSaga } from './sync'
import { createPlaylistSaga } from './playlist'
import { autoSyncSaga } from './automation'
import { notificationSaga } from './notification'

/**
 * Root saga
 */
export function* rootSaga() {
  yield take(HYDRATE)
  yield takeEvery(SET_SETTINGS, themeUpdateSaga)
  yield takeLeading(AUTHORIZE, authorizeSaga)
  yield takeLeadingCancellable(SYNC, SYNC_CANCEL, syncSaga)
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga)
  yield fork(autoSyncSaga)

  if (window.Notification) {
    yield fork(notificationSaga)
  }
}

export default rootSaga
