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
        title: (start) => start.format('MMMM'),
        start: moment().startOf('month'),
        end: moment().endOf('month'),
      },
      {
        title: (start) => start.format('MMMM'),
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

  return <div className="DateRangeShortcuts">{shortcuts.map(DateRangeShortcut)}</div>;
}

export default DateRangeShortcuts;
