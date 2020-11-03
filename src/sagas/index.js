import { takeLeadingCancellable } from 'sagas/helpers'
import { syncSaga } from 'sagas/sync'
import { createPlaylistSaga } from 'sagas/playlist'
import { SYNC, SYNC_CANCEL, CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL } from 'state/actions'

/**
 * Root saga
 */
function* rootSaga() {
  yield takeLeadingCancellable(SYNC, SYNC_CANCEL, syncSaga)
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga)
}

export default rootSaga
