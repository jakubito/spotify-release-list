import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import Media from 'react-media';
import { DateRangePicker } from 'react-dates';

const START_DATE_NAME = 'startDate';
const END_DATE_NAME = 'endDate';

function DateRangeField() {
  const [focus, setFocus] = useState(null);
  const { register, watch, errors, setValue, triggerValidation } = useFormContext();

  const datesChangeHandler = useCallback(
    ({ startDate, endDate }) => {
      setValue(START_DATE_NAME, startDate);
      setValue(END_DATE_NAME, endDate);

      if (startDate && endDate) {
        triggerValidation([START_DATE_NAME, END_DATE_NAME]);
      }
    },
    [setValue, triggerValidation]
  );

  const startDate = watch(START_DATE_NAME, null);
  const endDate = watch(END_DATE_NAME, null);

  register({ name: START_DATE_NAME }, { required: true });
  register({ name: END_DATE_NAME }, { required: true });

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
              onDatesChange={datesChangeHandler}
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

      {(errors.startDate || errors.endDate) && (
        <p className="help is-danger">
          {errors.startDate && errors.endDate && 'Start and end date are required.'}
          {errors.startDate && !errors.endDate && 'Start date is required.'}
          {errors.endDate && !errors.startDate && 'End date is required.'}
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

export default DateRangeField;
