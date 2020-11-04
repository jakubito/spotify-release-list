import React from 'react'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { min, max } from 'moment'
import { getReleasesMinMaxDatesMoment, getReleasesMap } from 'state/selectors'
import { FieldName } from 'enums'
import { getPlaylistNameSuggestion, getReleasesByDate, defer } from 'helpers'

const { START_DATE, END_DATE, NAME, NAME_CUSTOM, RELEASES, SELECTED_RELEASES } = FieldName

/**
 * Render date range field shortcut
 *
 * @param {DateRangeShortcut} props
 */
function DateRangeShortcut({ title, start, end }) {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment)
  const clickHandler = useClickHandler(start, end)
  const buttonTitle = title instanceof Function ? title(start, end) : title

  if (start.isAfter(maxDate) || end.isBefore(minDate)) {
    return null
  }

  return (
    <button
      type="button"
      className="DateRangeShortcut button is-dark is-darker is-rounded is-small has-text-weight-semibold"
      onClick={clickHandler}
      key={buttonTitle}
    >
      <span>{buttonTitle}</span>
    </button>
  )
}

/**
 * @param {Moment} start
 * @param {Moment} end
 */
function useClickHandler(start, end) {
  const releasesMap = useSelector(getReleasesMap)
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment)
  const { setValue, trigger, getValues } = useFormContext()

  const clickHandler = () => {
    const startDate = max(start, minDate)
    const endDate = min(end, maxDate)

    setValue(START_DATE, startDate)
    setValue(END_DATE, endDate)

    defer(() => {
      const filteredReleases = getReleasesByDate(releasesMap, startDate, endDate)

      setValue(RELEASES, filteredReleases)
      setValue(SELECTED_RELEASES, new Set(filteredReleases))
      trigger([START_DATE, END_DATE, RELEASES, SELECTED_RELEASES])

      if (!getValues(NAME_CUSTOM)) {
        setValue(NAME, getPlaylistNameSuggestion(startDate, endDate), {
          shouldValidate: true,
        })
      }
    })
  }

  return clickHandler
}

export default DateRangeShortcut
