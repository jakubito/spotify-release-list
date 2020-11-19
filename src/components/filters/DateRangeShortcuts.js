import moment from 'moment'
import { MomentFormat } from 'enums'
import DateRangeShortcut from './DateRangeShortcut'

const { MONTH_NAME } = MomentFormat

/**
 * Date range filter shortcuts definition
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
    title: (start) => start.format(MONTH_NAME),
    start: moment().startOf('month'),
    end: moment().endOf('month'),
  },
  {
    title: (start) => start.format(MONTH_NAME),
    start: moment().subtract(1, 'month').startOf('month'),
    end: moment().subtract(1, 'month').endOf('month'),
  },
]

/**
 * Render date range filter shortcuts
 *
 * @param {{ setValues: React.Dispatch<React.SetStateAction<StartEndDates>> }} props
 */
function DateRangeShortcuts({ setValues }) {
  return (
    <div className="DateRangeShortcuts">
      {shortcuts.map(({ title, start, end }, index) => (
        <DateRangeShortcut
          title={title}
          start={start}
          end={end}
          setValues={setValues}
          key={index}
        />
      ))}
    </div>
  )
}

export default DateRangeShortcuts
