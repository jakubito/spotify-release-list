import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import Media from 'react-media';
import { DateRangePicker } from 'react-dates';
import { getReleasesMinMaxDatesMoment } from '../../selectors';
import { getPlaylistNameSuggestion } from '../../helpers';
import { FieldName } from '../../enums';
import DateRangeShortcuts from './DateRangeShortcuts';

function DateRangeField() {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const [focus, setFocus] = useState(null);
  const { register, watch, errors, setValue, triggerValidation, getValues } = useFormContext();

  const isOutsideRangeHandler = useCallback(
    (day) => !day.isBetween(minDate, maxDate, 'day', '[]'),
    [minDate, maxDate]
  );

  const datesChangeHandler = useCallback(
    ({ startDate, endDate }) => {
      const values = getValues();

      setValue(FieldName.START_DATE, startDate);
      setValue(FieldName.END_DATE, endDate);

      if (startDate && endDate) {
        triggerValidation([FieldName.START_DATE, FieldName.END_DATE]);
      }

      if (!values[FieldName.NAME_CUSTOM]) {
        setValue(FieldName.NAME, getPlaylistNameSuggestion(startDate, endDate));
      }
    },
    [setValue, getValues, triggerValidation]
  );

  register({ name: FieldName.START_DATE }, { required: true });
  register({ name: FieldName.END_DATE }, { required: true });

  const startDate = watch(FieldName.START_DATE);
  const endDate = watch(FieldName.END_DATE);

  return (
    <div className="field">
      <label className="label has-text-light">Date range</label>
      <div className="control date-range has-text-grey">
        <Media query={{ maxWidth: 425 }}>
          {(matches) => (
            <DateRangePicker
              startDate={startDate}
              startDateId="new_playlist_start_date"
              endDate={endDate}
              endDateId="new_playlist_end_date"
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
      </div>

      {(errors[FieldName.START_DATE] || errors[FieldName.END_DATE]) && (
        <p className="help is-danger">
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
