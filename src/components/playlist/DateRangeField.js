import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import Media from 'react-media';
import { DateRangePicker } from 'react-dates';
import { getReleasesMinMaxDatesMoment } from '../../selectors';
import DateRangeShortcuts from './DateRangeShortcuts';

function DateRangeField({ startDateName, endDateName }) {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const [focus, setFocus] = useState(null);
  const { register, watch, errors, setValue, triggerValidation } = useFormContext();

  const isOutsideRangeHandler = useCallback(
    (day) => !day.isBetween(minDate, maxDate, 'day', '[]'),
    [minDate, maxDate]
  );

  const datesChangeHandler = useCallback(
    ({ startDate, endDate }) => {
      setValue(startDateName, startDate);
      setValue(endDateName, endDate);

      if (startDate && endDate) {
        triggerValidation([startDateName, endDateName]);
      }
    },
    [setValue, startDateName, endDateName, triggerValidation]
  );

  register({ name: startDateName }, { required: true });
  register({ name: endDateName }, { required: true });

  const startDate = watch(startDateName);
  const endDate = watch(endDateName);

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

      {(errors[startDateName] || errors[endDateName]) && (
        <p className="help is-danger">
          {errors[startDateName] && errors[endDateName] && 'Start and end date are required.'}
          {errors[startDateName] && !errors[endDateName] && 'Start date is required.'}
          {errors[endDateName] && !errors[startDateName] && 'End date is required.'}
        </p>
      )}

      <DateRangeShortcuts startDateName={startDateName} endDateName={endDateName} />
    </div>
  );
}

DateRangeField.propTypes = {
  startDateName: PropTypes.string.isRequired,
  endDateName: PropTypes.string.isRequired,
};

export default DateRangeField;
