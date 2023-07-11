import { fork, take, takeEvery, takeLeading } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist'
import {
  applyLabelBlocklist,
  authorize,
  authorizeError,
  createPlaylist,
  createPlaylistCancel,
  reset,
  setSettings,
  sync,
  syncCancel,
} from 'state/actions'
import { deleteAuthData } from 'auth'
import { albumsNew, albumsHistory } from 'albums'
import { takeLeadingCancellable } from './helpers'
import { themeUpdateSaga } from './theme'
import { authorizeErrorSaga, authorizeSaga } from './auth'
import { syncSaga } from './sync'
import { createPlaylistSaga } from './playlist'
import { autoSyncSaga } from './automation'
import { updateSaga } from './update'
import { notificationSaga } from './notification'
import { firstDayOfWeekUpdateSaga } from './locale'

/**
 * Root saga
 */
export function* rootSaga() {
  yield take(REHYDRATE)
  yield takeEvery(setSettings.type, themeUpdateSaga)
  yield takeEvery(setSettings.type, firstDayOfWeekUpdateSaga)
  yield takeEvery(reset.type, deleteAuthData)
  yield takeEvery(reset.type, albumsNew.clear)
  yield takeEvery(reset.type, albumsHistory.clear)
  yield takeEvery(applyLabelBlocklist.type, albumsNew.persist)
  yield takeEvery(authorizeError.type, authorizeErrorSaga)
  yield takeLeading(authorize.type, authorizeSaga)
  yield takeLeadingCancellable(sync.type, syncCancel.type, syncSaga)
  yield takeLeadingCancellable(createPlaylist.type, createPlaylistCancel.type, createPlaylistSaga)
  yield fork(autoSyncSaga)

  if (navigator.serviceWorker) yield fork(updateSaga)
  if (window.Notification) yield fork(notificationSaga)
}

export default rootSaga
