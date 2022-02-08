import { call, delay, fork, put, race, select, take, takeEvery } from 'redux-saga/effects'
import moment from 'moment'
import {
  autoSyncStart,
  autoSyncStop,
  reset,
  setSettings,
  sync,
  syncCancel,
  syncError,
  syncFinished,
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
  yield takeLeadingCancellable(autoSyncStart.type, autoSyncStop.type, autoSyncManager)
  yield takeEvery(setSettings.type, settingWatcher)
  yield takeEvery(syncFinished.type, syncFinishedWatcher)
  yield takeEvery(reset.type, resetWatcher)
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
    yield call(blur.close)
    yield call(focus.close)
  }
}

/**
 * Background worker responsible for dispatching sync action when needed
 */
function* autoSyncWorker() {
  while (true) {
    yield delay(POLLING_INTERVAL)

    /** @type {ReturnType<typeof getLastSync>} */
    const lastSync = yield select(getLastSync)
    /** @type {ReturnType<typeof getLastAutoSync>} */
    const lastAutoSync = yield select(getLastAutoSync)
    /** @type {ReturnType<typeof getSettings>} */
    const { autoSyncTime } = yield select(getSettings)
    const [hours, minutes] = autoSyncTime.split(':').map(Number)
    const todaySync = moment().set({ hours, minutes, seconds: 1 })

    if (moment().isBefore(todaySync)) continue
    if (lastSync && todaySync.isBefore(lastSync)) continue
    if (lastAutoSync && todaySync.isBefore(lastAutoSync)) continue

    yield put(sync({ auto: true }))
    yield take([syncFinished.type, syncError.type, syncCancel.type])
  }
}

/**
 * Oversee autoSync setting changes
 *
 * @param {SetSettingsAction} action
 */
function* settingWatcher(action) {
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)
  const { autoSync } = action.payload

  if (!user) return
  if (autoSync === undefined) return

  if (autoSync) {
    yield put(autoSyncStart())
  } else {
    yield put(autoSyncStop())
  }
}

/**
 * Oversee sync finished action
 */
function* syncFinishedWatcher() {
  /** @type {ReturnType<typeof getSettings>} */
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
  /** @type {ReturnType<typeof getUser>} */
  const user = yield select(getUser)
  /** @type {ReturnType<typeof getSettings>} */
  const { autoSync } = yield select(getSettings)

  if (user && autoSync) {
    yield put(autoSyncStart())
  }
}
