import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import Media from 'react-media';
import { DateRangePicker } from 'react-dates';
import { getReleasesMinMaxDatesMoment, getDayReleasesMap } from 'selectors';
import { getPlaylistNameSuggestion, getReleasesByDate, delay } from 'helpers';
import { FieldName, Moment } from 'enums';
import DateRangeShortcuts from './DateRangeShortcuts';

function useIsOutsideRangeHandler() {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);

  return useCallback((day) => !day.isBetween(minDate, maxDate, Moment.DAY, '[]'), [
    minDate,
    maxDate,
  ]);
}

function useDatesChangeHandler() {
  const releases = useSelector(getDayReleasesMap);
  const { setValue, triggerValidation, getValues } = useFormContext();

  return useCallback(
    ({ startDate, endDate }) => {
      setValue(FieldName.START_DATE, startDate);
      setValue(FieldName.END_DATE, endDate);

      if (startDate && endDate) {
        delay(() => {
          const filteredReleases = getReleasesByDate(releases, startDate, endDate);

          setValue(FieldName.RELEASES, filteredReleases);
          setValue(FieldName.SELECTED_RELEASES, new Set(filteredReleases));

          triggerValidation([
            FieldName.START_DATE,
            FieldName.END_DATE,
            FieldName.RELEASES,
            FieldName.SELECTED_RELEASES,
          ]);

          if (!getValues(FieldName.NAME_CUSTOM)) {
            setValue(FieldName.NAME, getPlaylistNameSuggestion(startDate, endDate), true);
          }
        });
      }
    },
    [releases, setValue, triggerValidation, getValues]
  );
}

function DateRangeField() {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const [focus, setFocus] = useState(null);
  const { watch, errors } = useFormContext();
  const isOutsideRangeHandler = useIsOutsideRangeHandler();
  const datesChangeHandler = useDatesChangeHandler();

  const startDate = watch(FieldName.START_DATE);
  const endDate = watch(FieldName.END_DATE);

  return (
    <div className="field">
      <label className="label has-text-light">Date range</label>

      <Media query={{ maxWidth: 425 }}>
        {(matches) => (
          <DateRangePicker
            startDate={startDate}
            startDateId="newPlaylistStartDate"
            endDate={endDate}
            endDateId="newPlaylistEndDate"
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

      {(errors[FieldName.START_DATE] ||
        errors[FieldName.END_DATE] ||
        errors[FieldName.RELEASES]) && (
        <p className="help is-danger">
          {!errors[FieldName.START_DATE] &&
            !errors[FieldName.END_DATE] &&
            errors[FieldName.RELEASES] &&
            'No releases found.'}
          {errors[FieldName.START_DATE] &&
            errors[FieldName.END_DATE] &&
            'Start and end date are required.'}
          {errors[FieldName.START_DATE] && !errors[FieldName.END_DATE] && 'Start date is required.'}
          {errors[FieldName.END_DATE] && !errors[FieldName.START_DATE] && 'End date is required.'}
        </p>
      )}

      <DateRangeShortcuts />
    </div>
  );
}

export default DateRangeField;
