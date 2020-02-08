import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { min, max } from 'moment';
import { getReleasesMinMaxDatesMoment } from '../../selectors';

function DateRangeShortcut({ title, start, end, startDateName, endDateName }) {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const { setValue } = useFormContext();
  const clickHandler = useCallback(
    (event) => {
      event.preventDefault();
      setValue(startDateName, max(start, minDate));
      setValue(endDateName, min(end, maxDate));
    },
    [setValue, startDateName, endDateName, start, end, minDate, maxDate]
  );

  if (start.isAfter(maxDate) || end.isBefore(minDate)) {
    return null;
  }

  return (
    <button className="button is-dark is-rounded is-small" onClick={clickHandler}>
      <span>{title}</span>
    </button>
  );
}

DateRangeShortcut.propTypes = {
  title: PropTypes.string.isRequired,
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  startDateName: PropTypes.string.isRequired,
  endDateName: PropTypes.string.isRequired,
};

export default DateRangeShortcut;
