import React from 'react';
import { useSelector } from 'react-redux';
import { getDayReleasesSortedEntries } from '../selectors';
import NoData from './NoData';
import ReleaseDay from './ReleaseDay';

function Releases() {
  const releases = useSelector(getDayReleasesSortedEntries);

  if (!releases.length) {
    return <NoData title="No albums to display 😕" />;
  }

  return releases.map(([date, albums]) => <ReleaseDay date={date} albums={albums} key={date} />);
}

export default Releases;
