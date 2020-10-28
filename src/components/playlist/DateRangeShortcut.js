import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { min, max } from 'moment'
import { getReleasesMinMaxDatesMoment, getReleasesMap } from 'selectors'
import { FieldName } from 'enums'
import { getPlaylistNameSuggestion, getReleasesByDate, defer } from 'helpers'

/**
 * Render date range shortcut
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

DateRangeShortcut.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
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

    setValue(FieldName.START_DATE, startDate)
    setValue(FieldName.END_DATE, endDate)

    defer(() => {
      const filteredReleases = getReleasesByDate(releasesMap, startDate, endDate)

      setValue(FieldName.RELEASES, filteredReleases)
      setValue(FieldName.SELECTED_RELEASES, new Set(filteredReleases))

      trigger([
        FieldName.START_DATE,
        FieldName.END_DATE,
        FieldName.RELEASES,
        FieldName.SELECTED_RELEASES,
      ])

      if (!getValues(FieldName.NAME_CUSTOM)) {
        setValue(FieldName.NAME, getPlaylistNameSuggestion(startDate, endDate), {
          shouldValidate: true,
        })
      }
    })
  }

  return clickHandler
}

export default DateRangeShortcut
