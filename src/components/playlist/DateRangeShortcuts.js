import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateRangeShortcut from './DateRangeShortcut';

function DateRangeShortcuts({ startDateName, endDateName }) {
  const shortcuts = useMemo(
    () => [
      {
        title: 'Current week',
        start: moment().startOf('week'),
        end: moment().endOf('week'),
      },
      {
        title: 'Last week',
        start: moment()
          .subtract(1, 'week')
          .startOf('week'),
        end: moment()
          .subtract(1, 'week')
          .endOf('week'),
      },
      {
        title: 'Current month',
        start: moment().startOf('month'),
        end: moment().endOf('month'),
      },
      {
        title: 'Last month',
        start: moment()
          .subtract(1, 'month')
          .startOf('month'),
        end: moment()
          .subtract(1, 'month')
          .endOf('month'),
      },
    ],
    []
  );

  return (
    <div className="DateRangeShortcuts">
      {shortcuts.map(({ title, start, end }) => (
        <DateRangeShortcut
          key={title}
          title={title}
          start={start}
          end={end}
          startDateName={startDateName}
          endDateName={endDateName}
        />
      ))}
    </div>
  );
}

DateRangeShortcuts.propTypes = {
  startDateName: PropTypes.string.isRequired,
  endDateName: PropTypes.string.isRequired,
};

export default DateRangeShortcuts;
