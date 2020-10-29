import React from 'react'
import moment from 'moment'
import DateRangeShortcut from './DateRangeShortcut'

/**
 * Date range field shortcuts definition
 *
 * @type {DateRangeShortcut[]}
 */
const shortcuts = [
  {
    title: 'Today',
    start: moment().startOf('day'),
    end: moment().endOf('day'),
  },
  {
    title: 'Yesterday',
    start: moment().subtract(1, 'day').startOf('day'),
    end: moment().subtract(1, 'day').endOf('day'),
  },
  {
    title: 'This week',
    start: moment().startOf('isoWeek'),
    end: moment().endOf('isoWeek'),
  },
  {
    title: 'Last week',
    start: moment().subtract(1, 'week').startOf('isoWeek'),
    end: moment().subtract(1, 'week').endOf('isoWeek'),
  },
  {
    title: (start) => start.format('MMMM'),
    start: moment().startOf('month'),
    end: moment().endOf('month'),
  },
  {
    title: (start) => start.format('MMMM'),
    start: moment().subtract(1, 'month').startOf('month'),
    end: moment().subtract(1, 'month').endOf('month'),
  },
]

/**
 * Render date range field shortcuts
 */
function DateRangeShortcuts() {
  return <div className="DateRangeShortcuts">{shortcuts.map(DateRangeShortcut)}</div>
}

export default DateRangeShortcuts
