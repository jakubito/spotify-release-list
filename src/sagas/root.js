import { takeEvery } from 'redux-saga/effects'
import { createPlaylist, createPlaylistCancel, setSettings, sync, syncCancel } from 'state/actions'
import { takeLeadingCancellable } from './helpers'
import { themeUpdateSaga } from './theme'
import { syncSaga } from './sync'
import { createPlaylistSaga } from './playlist'
import { firstDayOfWeekUpdateSaga } from './locale'

/**
 * Root saga
 */
export function* rootSaga() {
  yield takeEvery(setSettings.type, themeUpdateSaga)
  yield takeEvery(setSettings.type, firstDayOfWeekUpdateSaga)
  yield takeLeadingCancellable(sync.type, syncCancel.type, syncSaga)
  yield takeLeadingCancellable(createPlaylist.type, createPlaylistCancel.type, createPlaylistSaga)
}

export default rootSaga
