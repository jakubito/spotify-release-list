import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Waypoint } from 'react-waypoint';
import { getDayReleasesSortedEntries } from 'selectors';
import NoData from './NoData';
import ReleaseDay from './ReleaseDay';

const DAYS_INCREMENT = 20;

function Releases() {
  const releases = useSelector(getDayReleasesSortedEntries);
  const [daysLimit, setDaysLimit] = useState(DAYS_INCREMENT);

  const waypointOnEnter = useCallback(() => {
    setDaysLimit((currentLimit) => currentLimit + DAYS_INCREMENT);
  }, []);

  if (!releases.length) {
    return <NoData title="No albums to display 😕" />;
  }

  return (
    <>
      {releases.slice(0, daysLimit).map(([date, albums]) => (
        <ReleaseDay date={date} albums={albums} key={date} />
      ))}
      {daysLimit < releases.length && (
        <Waypoint bottomOffset="-100%" onEnter={waypointOnEnter} key={daysLimit} />
      )}
    </>
  );
}

export default Releases;
