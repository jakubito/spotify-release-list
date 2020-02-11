import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Album from './Album';

function ReleaseDay({ date, albums }) {
  return (
    <div className="ReleaseDay columns is-gapless has-text-grey has-text-weight-semibold">
      <div className="column is-size-4 date">{moment(date).format('MMMM D')}</div>
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
