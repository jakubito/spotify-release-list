import { takeEvery } from 'redux-saga/effects'
import moment from 'moment'
import { Theme } from 'enums'
import { setSettings } from 'state/actions'

export function* settingsSaga() {
  yield takeEvery(setSettings.type, themeUpdate)
  yield takeEvery(setSettings.type, firstDayOfWeekUpdate)
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
