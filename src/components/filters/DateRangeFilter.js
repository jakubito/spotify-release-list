import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Media from 'react-media'
import { DateRangePicker } from 'react-dates'
import classNames from 'classnames'
import { getFiltersDates, getReleasesMinMaxDates } from 'state/selectors'
import { setFilters } from 'state/actions'
import { defer } from 'helpers'
import { MomentFormat } from 'enums'
import { Button } from 'components/common'
import DateRangeShortcuts from './DateRangeShortcuts'

const { ISO_DATE } = MomentFormat

/**
 * Render date range filter
 */
function DateRangeFilter() {
  const dispatch = useDispatch()
  const filtersDates = useSelector(getFiltersDates)
  const { minDate, maxDate } = useSelector(getReleasesMinMaxDates)

  const [focus, setFocus] = useState(null)
  const [values, setValues] = useState({
    startDate: filtersDates?.startDate,
    endDate: filtersDates?.endDate,
  })

  /** @param {Moment} day */
  const isOutsideRange = (day) => !day.isBetween(minDate, maxDate, 'day', '[]')

  const reset = () => {
    setValues({ startDate: null, endDate: null })
    defer(dispatch, setFilters({ startDate: null, endDate: null }))
  }

  useEffect(() => {
    const { startDate, endDate } = values

    if (startDate && endDate) {
      defer(
        dispatch,
        setFilters({
          startDate: startDate.format(ISO_DATE),
          endDate: endDate.format(ISO_DATE),
        })
      )
    }
  }, [values])

  return (
    <div className={classNames('DateRangeFilter Filters__filter', { focused: focus })}>
      <Media query={{ maxWidth: 425 }}>
        {(matches) => (
          <DateRangePicker
            startDate={values.startDate}
            endDate={values.endDate}
            startDateId="startDateFilter"
            endDateId="endDateFilter"
            minDate={minDate}
            maxDate={maxDate}
            onDatesChange={setValues}
            isOutsideRange={isOutsideRange}
            focusedInput={focus}
            onFocusChange={setFocus}
            numberOfMonths={1}
            firstDayOfWeek={1}
            minimumNights={0}
            verticalSpacing={10}
            readOnly={matches}
            hideKeyboardShortcutsPanel
          />
        )}
      </Media>
      <DateRangeShortcuts setValues={setValues} />
      {filtersDates && <Button title="Reset" className="reset" onClick={reset} text />}
    </div>
  )
}

export default DateRangeFilter
