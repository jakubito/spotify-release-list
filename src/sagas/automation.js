import { call, delay, fork, put, race, select, take, takeEvery } from 'redux-saga/effects'
import moment from 'moment'
import {
  autoSyncStart,
  autoSyncStop,
  sync,
  AUTO_SYNC_START,
  AUTO_SYNC_STOP,
  SYNC_CANCEL,
  SYNC_ERROR,
  SYNC_FINISHED,
  SET_SETTINGS,
  SET_USER,
  RESET,
} from 'state/actions'
import { getLastAutoSync, getLastSync, getSettings, getUser } from 'state/selectors'
import { takeLeadingCancellable, windowEventChannel } from './helpers'

/**
 * Background auto sync worker polling interval
 */
const POLLING_INTERVAL = 60 * 1000

/**
 * Main auto sync saga
 */
export function* autoSyncSaga() {
  yield takeLeadingCancellable(AUTO_SYNC_START, AUTO_SYNC_STOP, autoSyncManager)
  yield takeEvery(SET_SETTINGS, settingWatcher)
  yield takeEvery(SET_USER, userWatcher)
  yield takeEvery(RESET, resetWatcher)
  yield fork(initialStart)
}

/**
 * Manager saga responsible for spawning / cancelling worker on browser focus changes
 */
function* autoSyncManager() {
  /** @type {EventChannel<WindowEventMap['blur']>} */
  const blur = yield call(windowEventChannel, 'blur')
  /** @type {EventChannel<WindowEventMap['focus']>} */
  const focus = yield call(windowEventChannel, 'focus')

  try {
    while (true) {
      yield take(blur)
      yield race([call(autoSyncWorker), take(focus)])
    }
  } finally {
    blur.close()
    focus.close()
  }
}

/**
 * Background worker responsible for dispatching sync action when needed
 */
function* autoSyncWorker() {
  while (true) {
    yield delay(POLLING_INTERVAL)

    /** @type {ReturnType<getLastSync>} */
    const lastSync = yield select(getLastSync)
    /** @type {ReturnType<getLastAutoSync>} */
    const lastAutoSync = yield select(getLastAutoSync)
    /** @type {ReturnType<getSettings>} */
    const { autoSyncTime } = yield select(getSettings)
    const [hours, minutes] = autoSyncTime.split(':').map(Number)
    const todaySync = moment().set({ hours, minutes, seconds: 1 })

    if (moment().isBefore(todaySync)) continue
    if (lastSync && todaySync.isBefore(lastSync)) continue
    if (lastAutoSync && todaySync.isBefore(lastAutoSync)) continue

    yield put(sync(true))
    yield take([SYNC_FINISHED, SYNC_ERROR, SYNC_CANCEL])
  }
}

/**
 * Oversee autoSync setting changes
 *
 * @param {SetSettingsAction} action
 */
function* settingWatcher(action) {
  /** @type {ReturnType<getUser>} */
  const user = yield select(getUser)
  const { autoSync } = action.payload.settings

  if (!user) return
  if (autoSync === undefined) return

  if (autoSync) {
    yield put(autoSyncStart())
  } else {
    yield put(autoSyncStop())
  }
}

/**
 * Oversee user changes
 */
function* userWatcher() {
  /** @type {ReturnType<getSettings>} */
  const { autoSync } = yield select(getSettings)

  if (autoSync) {
    yield put(autoSyncStart())
  }
}

/**
 * Stop service when app is reset
 */
function* resetWatcher() {
  yield put(autoSyncStop())
}

/**
 * Start service on initial load
 */
function* initialStart() {
  /** @type {ReturnType<getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<getSettings>} */
  const { autoSync } = yield select(getSettings)

  if (user && autoSync) {
    yield put(autoSyncStart())
  }
}
