import { fork } from 'redux-saga/effects'
import { createPlaylist, createPlaylistCancel, sync, syncCancel } from 'state/actions'
import { takeLeadingCancellable } from './helpers'
import { syncSaga } from './sync'
import { createPlaylistSaga } from './playlist'
import { settingsSaga } from './settings'

/**
 * Root saga
 */
export function* rootSaga() {
  yield takeLeadingCancellable(sync.type, syncCancel.type, syncSaga)
  yield takeLeadingCancellable(createPlaylist.type, createPlaylistCancel.type, createPlaylistSaga)
  yield fork(settingsSaga)
}

export default rootSaga
