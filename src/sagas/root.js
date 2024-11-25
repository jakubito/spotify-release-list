import { fork, take, takeEvery, takeLeading } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist'
import {
  applyLabelBlocklist,
  authorize,
  authorizeError,
  createPlaylist,
  createPlaylistCancel,
  downloadAlbumsCsv,
  loadPlaylists,
  reset,
  showUpdatePlaylistModal,
  sync,
  syncCancel,
  updatePlaylist,
  updatePlaylistCancel,
} from 'state/actions'
import { deleteAuthData } from 'auth'
import { albumsNew, albumsHistory } from 'albums'
import { takeLeadingCancellable } from './helpers'
import { authorizeErrorSaga, authorizeSaga } from './auth'
import { syncSaga } from './sync'
import {
  createPlaylistSaga,
  loadPlaylistsSaga,
  refreshPlaylistsSaga,
  updatePlaylistSaga,
} from './playlist'
import { autoSyncSaga } from './automation'
import { updateSaga } from './update'
import { notificationSaga } from './notification'
import { settingsSaga } from './settings'
import { downloadAlbumsCsvSaga } from './csv'

/**
 * Root saga
 */
export function* rootSaga() {
  yield take(REHYDRATE)

  yield takeEvery(reset.type, deleteAuthData)
  yield takeEvery(reset.type, albumsNew.clear)
  yield takeEvery(reset.type, albumsHistory.clear)
  yield takeEvery(applyLabelBlocklist.type, albumsNew.persist)
  yield takeEvery(authorizeError.type, authorizeErrorSaga)
  yield takeEvery(showUpdatePlaylistModal.type, refreshPlaylistsSaga)

  yield takeLeading(authorize.type, authorizeSaga)
  yield takeLeading(loadPlaylists.type, loadPlaylistsSaga)
  yield takeLeading(downloadAlbumsCsv.type, downloadAlbumsCsvSaga)

  yield takeLeadingCancellable(sync.type, syncCancel.type, syncSaga)
  yield takeLeadingCancellable(createPlaylist.type, createPlaylistCancel.type, createPlaylistSaga)
  yield takeLeadingCancellable(updatePlaylist.type, updatePlaylistCancel.type, updatePlaylistSaga)

  yield fork(autoSyncSaga)
  yield fork(settingsSaga)

  if (navigator.serviceWorker) yield fork(updateSaga)
  if (window.Notification) yield fork(notificationSaga)
}

export default rootSaga
