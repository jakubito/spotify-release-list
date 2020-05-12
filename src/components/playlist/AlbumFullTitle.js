import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAlbums, getArtists } from '../../selectors';
import { mergeAlbumArtists } from '../../helpers';

function AlbumFullTitle({ id }) {
  const albums = useSelector(getAlbums);
  const artistsMap = useSelector(getArtists);
  const album = albums[id];
  const artists = mergeAlbumArtists(album, artistsMap)
    .map((artist) => artist.name)
    .join(', ');

  return (
    <span className="AlbumFullTitle">
      {album.name}
      <span className="has-text-weight-normal is-italic"> - {artists}</span>
    </span>
  );
}

AlbumFullTitle.propTypes = {
  id: PropTypes.string.isRequired,
};

export default memo(AlbumFullTitle);
