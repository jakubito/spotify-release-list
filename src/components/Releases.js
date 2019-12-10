import React from 'react';
import { useSelector } from 'react-redux';
import { getDayReleasesSortedEntries, getArtistsCount } from '../selectors';
import NoData from './NoData';
import ReleaseDay from './ReleaseDay';

function Releases() {
  const artistsCount = useSelector(getArtistsCount);
  const releases = useSelector(getDayReleasesSortedEntries);

  if (!artistsCount) {
    return (
      <NoData title="You don't follow any artists. Only albums released by artists you follow will appear here." />
    );
  }

  if (!releases.length) {
    return <NoData title="No albums to display. Try to change settings." />;
  }

  return releases.map(([date, albums]) => <ReleaseDay date={date} albums={albums} key={date} />);
}

export default Releases;
