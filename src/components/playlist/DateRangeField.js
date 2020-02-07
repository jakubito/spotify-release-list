import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import Media from 'react-media';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { getReleasesMinMaxDates } from '../../selectors';

function DateRangeField({ startDateName, endDateName }) {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDates);
  const [focus, setFocus] = useState(null);
  const { register, watch, errors, setValue, triggerValidation } = useFormContext();

  const [minDateMoment, maxDateMoment] = useMemo(() => [moment(minDate), moment(maxDate)], [
    minDate,
    maxDate,
  ]);

  const isOutsideRangeHandler = useCallback(
    (day) => !day.isBetween(minDateMoment, maxDateMoment, 'day', '[]'),
    [minDateMoment, maxDateMoment]
  );

  const datesChangeHandler = useCallback(
    ({ startDate, endDate }) => {
      setValue(startDateName, startDate);
      setValue(endDateName, endDate);

      if (startDate && endDate) {
        triggerValidation([startDateName, endDateName]);
      }
    },
    [setValue, triggerValidation]
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
              minDate={minDateMoment}
              maxDate={maxDateMoment}
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

      <div className="date-helpers">
        <button className="button is-dark is-rounded is-small">
          <span>Last week</span>
        </button>
        <button className="button is-dark is-rounded is-small">
          <span>Last 2 weeks</span>
        </button>
      </div>
    </div>
  );
}

DateRangeField.propTypes = {
  startDateName: PropTypes.string.isRequired,
  endDateName: PropTypes.string.isRequired,
};

export default DateRangeField;
