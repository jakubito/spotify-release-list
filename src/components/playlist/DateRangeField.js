import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import Media from 'react-media'
import { DateRangePicker } from 'react-dates'
import { getReleasesMinMaxDatesMoment, getReleasesMap } from 'state/selectors'
import { getPlaylistNameSuggestion, getReleasesByDate, defer } from 'helpers'
import { FieldName } from 'enums'
import DateRangeShortcuts from './DateRangeShortcuts'

const { START_DATE, END_DATE, NAME, NAME_CUSTOM, RELEASES, SELECTED_RELEASES } = FieldName

/**
 * Render date range form field
 */
function DateRangeField() {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment)
  const [focus, setFocus] = useState(null)
  const { watch, errors } = useFormContext()
  const isOutsideRangeHandler = useIsOutsideRangeHandler()
  const datesChangeHandler = useDatesChangeHandler()

  const startDate = watch(START_DATE)
  const endDate = watch(END_DATE)

  return (
    <div className="field">
      <label className="label has-text-light" htmlFor={START_DATE}>
        Date range
      </label>

      <Media query={{ maxWidth: 425 }}>
        {(matches) => (
          <DateRangePicker
            startDate={startDate}
            startDateId={START_DATE}
            endDate={endDate}
            endDateId={END_DATE}
            minDate={minDate}
            maxDate={maxDate}
            onDatesChange={datesChangeHandler}
            isOutsideRange={isOutsideRangeHandler}
            focusedInput={focus}
            onFocusChange={setFocus}
            numberOfMonths={1}
            firstDayOfWeek={1}
            minimumNights={0}
            readOnly={matches}
          />
        )}
      </Media>

      {(errors[START_DATE] || errors[END_DATE] || errors[RELEASES]) && (
        <p className="help is-danger">
          {!errors[START_DATE] && !errors[END_DATE] && errors[RELEASES] && 'No releases found.'}
          {errors[START_DATE] && errors[END_DATE] && 'Start and end date are required.'}
          {errors[START_DATE] && !errors[END_DATE] && 'Start date is required.'}
          {errors[END_DATE] && !errors[START_DATE] && 'End date is required.'}
        </p>
      )}

      <DateRangeShortcuts />
    </div>
  )
}

function useIsOutsideRangeHandler() {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment)

  const isOutsideRangeHandler = useCallback(
    /** @param {Moment} day */
    (day) => !day.isBetween(minDate, maxDate, 'day', '[]'),
    [minDate, maxDate]
  )

  return isOutsideRangeHandler
}

function useDatesChangeHandler() {
  const releasesMap = useSelector(getReleasesMap)
  const { setValue, trigger, getValues } = useFormContext()

  const datesChangeHandler = useCallback(
    /** @param {{ startDate: Moment, endDate: Moment }} values */
    ({ startDate, endDate }) => {
      setValue(START_DATE, startDate)
      setValue(END_DATE, endDate)

      if (startDate && endDate) {
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
    },
    [releasesMap, setValue, trigger, getValues]
  )

  return datesChangeHandler
}

export default DateRangeField
