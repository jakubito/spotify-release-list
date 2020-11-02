import { call, race, take, fork, cancel } from 'redux-saga/effects'
import { SYNC, SYNC_CANCEL, CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL } from 'state/actions'
import { syncSaga } from './sync'
import { createPlaylistSaga } from './playlist'

/**
 * Behaves the same way as redux-saga's `takeLeading` but can be cancelled
 *
 * @param {string} triggerAction
 * @param {string} cancelAction
 * @param {(...args: any[]) => any} saga
 * @param {...any} args
 */
function takeLeadingCancellable(triggerAction, cancelAction, saga, ...args) {
  return fork(function* () {
    while (true) {
      const action = yield take(triggerAction)
      const task = yield fork(saga, ...args.concat(action))
      const [cancelled] = yield race([take(cancelAction), call(task.toPromise)])

      if (cancelled) {
        yield cancel(task)
      }
    }
  })
}

/**
 * Root saga
 */
function* rootSaga() {
  yield takeLeadingCancellable(SYNC, SYNC_CANCEL, syncSaga)
  yield takeLeadingCancellable(CREATE_PLAYLIST, CREATE_PLAYLIST_CANCEL, createPlaylistSaga)
}

export default rootSaga
