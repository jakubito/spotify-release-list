import React from 'react'
import { useSelector } from 'react-redux'
import { min, max } from 'moment'
import { getReleasesMinMaxDates } from 'state/selectors'
import Button from 'components/Button'

/**
 * Render date range filter shortcut
 *
 * @param {DateRangeShortcut & {
 *   setValues: React.Dispatch<React.SetStateAction<StartEndDates>>
 * }} props
 */
function DateRangeShortcut({ title, start, end, setValues }) {
  const { minDate, maxDate } = useSelector(getReleasesMinMaxDates)
  const buttonTitle = title instanceof Function ? title(start, end) : title

  const onClick = () => {
    setValues({ startDate: max(start, minDate), endDate: min(end, maxDate) })
  }

  if (start.isAfter(maxDate) || end.isBefore(minDate)) {
    return null
  }

  return <Button title={buttonTitle} className="DateRangeShortcut" onClick={onClick} text small />
}

export default DateRangeShortcut
