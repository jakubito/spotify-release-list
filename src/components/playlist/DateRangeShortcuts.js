import React, { useMemo } from 'react';
import moment from 'moment';
import DateRangeShortcut from './DateRangeShortcut';
import { Moment } from '../../enums';

function DateRangeShortcuts() {
  const shortcuts = useMemo(
    () => [
      {
        title: 'Today',
        start: moment().startOf(Moment.DAY),
        end: moment().endOf(Moment.DAY),
      },
      {
        title: 'Yesterday',
        start: moment()
          .subtract(1, Moment.DAY)
          .startOf(Moment.DAY),
        end: moment()
          .subtract(1, Moment.DAY)
          .endOf(Moment.DAY),
      },
      {
        title: 'This week',
        start: moment().startOf(Moment.ISO_WEEK),
        end: moment().endOf(Moment.ISO_WEEK),
      },
      {
        title: 'Last week',
        start: moment()
          .subtract(1, Moment.WEEK)
          .startOf(Moment.ISO_WEEK),
        end: moment()
          .subtract(1, Moment.WEEK)
          .endOf(Moment.ISO_WEEK),
      },
      {
        title: (start) => start.format('MMMM'),
        start: moment().startOf(Moment.MONTH),
        end: moment().endOf(Moment.MONTH),
      },
      {
        title: (start) => start.format('MMMM'),
        start: moment()
          .subtract(1, Moment.MONTH)
          .startOf(Moment.MONTH),
        end: moment()
          .subtract(1, Moment.MONTH)
          .endOf(Moment.MONTH),
      },
    ],
    []
  );

  return <div className="DateRangeShortcuts">{shortcuts.map(DateRangeShortcut)}</div>;
}

export default DateRangeShortcuts;
