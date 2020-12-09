import { SYNC, SYNC_CANCEL, CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL } from 'state/actions'
import { takeLeadingCancellable } from './helpers'
import syncSaga from './sync'
import createPlaylistSaga from './playlist'

/**
 * Root saga
 */
function* rootSaga() {
  yield takeLeadingCancellable(SYNC, SYNC_CANCEL, syncSaga)
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga)
}

export default rootSaga
