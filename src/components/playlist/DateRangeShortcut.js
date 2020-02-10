import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { min, max } from 'moment';
import { getReleasesMinMaxDatesMoment, getDayReleasesMap } from '../../selectors';
import { FieldName } from '../../enums';
import { getPlaylistNameSuggestion, calculateReleasesCount } from '../../helpers';

function useClickHandler(start, end) {
  const releases = useSelector(getDayReleasesMap);
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const { setValue, triggerValidation, getValues } = useFormContext();

  return useCallback(
    (event) => {
      event.preventDefault();

      const values = getValues();
      const startDate = max(start, minDate);
      const endDate = min(end, maxDate);

      setValue(FieldName.START_DATE, startDate);
      setValue(FieldName.END_DATE, endDate);
      setValue(FieldName.RELEASES_COUNT, calculateReleasesCount(releases, startDate, endDate));
      triggerValidation([FieldName.START_DATE, FieldName.END_DATE, FieldName.RELEASES_COUNT]);

      if (!values[FieldName.NAME_CUSTOM]) {
        setValue(FieldName.NAME, getPlaylistNameSuggestion(startDate, endDate));
        triggerValidation(FieldName.NAME);
      }
    },
    [setValue, getValues, start, end, minDate, maxDate, triggerValidation, releases]
  );
}

function useButtonTitle(title, start, end) {
  return useMemo(() => (title instanceof Function ? title(start, end) : title), [
    title,
    start,
    end,
  ]);
}

function DateRangeShortcut({ title, start, end }) {
  const [minDate, maxDate] = useSelector(getReleasesMinMaxDatesMoment);
  const clickHandler = useClickHandler(start, end);
  const buttonTitle = useButtonTitle(title, start, end);

  if (start.isAfter(maxDate) || end.isBefore(minDate)) {
    return null;
  }

  return (
    <button
      className="DateRangeShortcut button is-dark is-rounded is-small has-text-weight-semibold"
      onClick={clickHandler}
      key={buttonTitle}
    >
      <span>{buttonTitle}</span>
    </button>
  );
}

DateRangeShortcut.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
};

export default DateRangeShortcut;
