import { call, takeEvery, takeLeading } from 'redux-saga/effects'
import moment from 'moment'
import { Theme } from 'enums'
import { setSettings } from 'state/actions'
import { albumsHistory, albumsNew } from 'albums'

export function* settingsSaga() {
  yield takeEvery(setSettings.type, themeUpdate)
  yield takeEvery(setSettings.type, firstDayOfWeekUpdate)
  yield takeLeading(setSettings.type, trackHistoryUpdate)
}

/**
 * Persist theme to document on every change
 *
 * @param {SetSettingsAction} action
 */
function themeUpdate(action) {
  const { classList } = document.documentElement
  const { theme } = action.payload
  if (theme === undefined) return

  classList.remove(...Object.values(Theme))
  if (theme) classList.add(...theme.split(' '))
}

/**
 * Update first day of week
 *
 * @param {SetSettingsAction} action
 */
function firstDayOfWeekUpdate(action) {
  const { firstDayOfWeek } = action.payload
  if (firstDayOfWeek === undefined) return

  moment.updateLocale(moment.locale(), { week: { dow: firstDayOfWeek } })
}

/**
 * @param {SetSettingsAction} action
 */
function* trackHistoryUpdate(action) {
  const { trackHistory } = action.payload
  if (trackHistory === undefined) return
  if (trackHistory === true) return

  albumsHistory.append(albumsNew)
  yield call(albumsNew.clear)
  yield call(albumsHistory.persist)
}
