import { call, delay, race, select, take } from 'redux-saga/effects'
import { createNotification } from 'helpers'
import { syncFinished } from 'state/actions'
import { getPreviousSyncMaxDate, getReleasesMaxDate, getSettings } from 'state/selectors'
import { windowEventChannel } from './helpers'

/**
 * Main notification saga
 */
export function* notificationSaga() {
  /** @type {EventChannel<WindowEventMap['blur']>} */
  const blur = yield call(windowEventChannel, 'blur')
  /** @type {EventChannel<WindowEventMap['focus']>} */
  const focus = yield call(windowEventChannel, 'focus')

  while (true) {
    yield take(blur)
    yield race([call(notificationWorker), take(focus)])
  }
}

/**
 * Notification worker
 */
function* notificationWorker() {
  yield delay(5 * 1000)

  while (true) {
    yield take(syncFinished.type)

    /** @type {ReturnType<typeof getSettings>} */
    const { notifications } = yield select(getSettings)
    /** @type {ReturnType<typeof getPreviousSyncMaxDate>} */
    const previousMaxDate = yield select(getPreviousSyncMaxDate)
    /** @type {ReturnType<typeof getReleasesMaxDate>} */
    const currentMaxDate = yield select(getReleasesMaxDate)

    if (Notification.permission !== 'granted') continue
    if (!notifications) continue
    if (!previousMaxDate) continue
    if (currentMaxDate === previousMaxDate) continue

    yield call(createNotification, 'New music has been released')
  }
}
