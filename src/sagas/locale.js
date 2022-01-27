import moment from 'moment'

/**
 * Update first day of week
 *
 * @param {SetSettingsAction} action
 */
export function firstDayOfWeekUpdateSaga(action) {
  const { firstDayOfWeek } = action.payload

  if (firstDayOfWeek === undefined) return

  moment.updateLocale(moment.locale(), { week: { dow: firstDayOfWeek } })
}
