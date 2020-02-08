import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { min, max } from 'moment';
import { getReleasesMinMaxDatesMoment } from '../../selectors';
import { FieldName } from '../../enums';
import { getPlaylistNameSuggestion } from '../../helpers';

function DateRangeShortcut({ title, start, end }) {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const { setValue, getValues } = useFormContext();

  const clickHandler = useCallback(
    (event) => {
      event.preventDefault();

      const values = getValues();
      const startDate = max(start, minDate);
      const endDate = min(end, maxDate);

      setValue(FieldName.START_DATE, startDate);
      setValue(FieldName.END_DATE, endDate);

      if (!values[FieldName.NAME_CUSTOM]) {
        setValue(FieldName.NAME, getPlaylistNameSuggestion(startDate, endDate));
      }
    },
    [setValue, getValues, start, end, minDate, maxDate]
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
};

export default DateRangeShortcut;
