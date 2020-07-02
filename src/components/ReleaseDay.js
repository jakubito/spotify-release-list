import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getPreviousSyncMaxDate } from 'selectors';
import Album from './Album';

function ReleaseDay({ date, albums }) {
  const previousSyncMaxDate = useSelector(getPreviousSyncMaxDate);

  return (
    <div className="ReleaseDay columns is-gapless has-text-grey has-text-weight-semibold">
      <div className="column is-size-4 date">
        {previousSyncMaxDate && date > previousSyncMaxDate && <span className="new">• </span>}
        {moment(date).format('MMMM D')}
      </div>
      <div className="column albums">
        {albums.map((album) => (
          <Album album={album} key={album.id} />
        ))}
      </div>
    </div>
  );
}

ReleaseDay.propTypes = {
  date: PropTypes.string.isRequired,
  albums: PropTypes.array.isRequired,
};

export default memo(ReleaseDay);
