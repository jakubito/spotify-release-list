import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../helpers';
import Album from './Album';

function ReleaseDay({ date, albums }) {
  return (
    <div className="ReleaseDay columns is-gapless has-text-grey has-text-weight-semibold">
      <div className="column is-size-4 date">{formatDate(date, 'MMMM d')}</div>
      <div className="column albums">
        {albums.map((album) => (
          <Album {...album} key={album.id} />
        ))}
      </div>
    </div>
  );
}

ReleaseDay.propTypes = {
  date: PropTypes.string.isRequired,
  albums: PropTypes.array.isRequired,
};

export default ReleaseDay;
