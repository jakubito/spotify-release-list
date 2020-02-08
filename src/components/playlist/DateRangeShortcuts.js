import React, { useMemo } from 'react';
import moment from 'moment';
import DateRangeShortcut from './DateRangeShortcut';

function DateRangeShortcuts() {
  const shortcuts = useMemo(
    () => [
      {
        title: 'Current week',
        start: moment().startOf('isoWeek'),
        end: moment().endOf('isoWeek'),
      },
      {
        title: 'Last week',
        start: moment()
          .subtract(1, 'week')
          .startOf('isoWeek'),
        end: moment()
          .subtract(1, 'week')
          .endOf('isoWeek'),
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
        <DateRangeShortcut key={title} title={title} start={start} end={end} />
      ))}
    </div>
  );
}

export default DateRangeShortcuts;
