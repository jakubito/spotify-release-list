import { useSelector } from 'react-redux'
import moment, { min, max } from 'moment'
import { MomentFormat } from 'enums'
import { getReleasesMinMaxDates } from 'state/selectors'
import { Button } from 'components/common'

const { MONTH_NAME } = MomentFormat
const today = '2022-05-10'

/**
 * Date range filter shortcuts definition
 *
 * @returns {DateRangeShortcut[]}
 */
function getShortcuts() {
  return [
    {
      title: 'Today',
      start: moment(today).startOf('day'),
      end: moment(today).endOf('day'),
    },
    {
      title: 'Yesterday',
      start: moment(today).subtract(1, 'day').startOf('day'),
      end: moment(today).subtract(1, 'day').endOf('day'),
    },
    {
      title: 'This week',
      start: moment(today).startOf('week'),
      end: moment(today).endOf('week'),
    },
    {
      title: 'Last week',
      start: moment(today).subtract(1, 'week').startOf('week'),
      end: moment(today).subtract(1, 'week').endOf('week'),
    },
    {
      title: (start) => start.format(MONTH_NAME),
      start: moment(today).startOf('month'),
      end: moment(today).endOf('month'),
    },
    {
      title: (start) => start.format(MONTH_NAME),
      start: moment(today).subtract(1, 'month').startOf('month'),
      end: moment(today).subtract(1, 'month').endOf('month'),
    },
  ]
}

/**
 * Render date range filter shortcuts
 *
 * @param {{ setValues: React.Dispatch<React.SetStateAction<StartEndDates>> }} props
 */
function DateRangeShortcuts({ setValues }) {
  const { minDate, maxDate } = useSelector(getReleasesMinMaxDates)
  const validShortcuts = getShortcuts().filter(
    ({ start, end }) => start.isSameOrBefore(maxDate) && end.isAfter(minDate)
  )

  return (
    <div className="DateRangeShortcuts">
      {validShortcuts.map(({ title, start, end }, index) => (
        <Button
          className="DateRangeShortcuts__button"
          title={title instanceof Function ? title(start, end) : title}
          onClick={() => setValues({ startDate: max(start, minDate), endDate: min(end, maxDate) })}
          key={index}
          text
          dark
          small
        />
      ))}
    </div>
  )
}

export default DateRangeShortcuts
