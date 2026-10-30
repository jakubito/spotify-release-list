import { fork, takeEvery, takeLeading } from 'redux-saga/effects'
import {
  createPlaylist,
  createPlaylistCancel,
  downloadAlbumsCsv,
  loadPlaylists,
  showUpdatePlaylistModal,
  sync,
  syncCancel,
  updatePlaylist,
  updatePlaylistCancel,
} from 'state/actions'
import { takeLeadingCancellable } from './helpers'
import { syncSaga } from './sync'
import {
  createPlaylistSaga,
  loadPlaylistsSaga,
  refreshPlaylistsSaga,
  updatePlaylistSaga,
} from './playlist'
import { settingsSaga } from './settings'
import { downloadAlbumsCsvSaga } from './csv'

/**
 * Root saga
 */
export function* rootSaga() {
  yield takeEvery(showUpdatePlaylistModal.type, refreshPlaylistsSaga)

  yield takeLeading(loadPlaylists.type, loadPlaylistsSaga)
  yield takeLeading(downloadAlbumsCsv.type, downloadAlbumsCsvSaga)

  yield takeLeadingCancellable(sync.type, syncCancel.type, syncSaga)
  yield takeLeadingCancellable(createPlaylist.type, createPlaylistCancel.type, createPlaylistSaga)
  yield takeLeadingCancellable(updatePlaylist.type, updatePlaylistCancel.type, updatePlaylistSaga)

  yield fork(settingsSaga)
}

export default rootSaga
