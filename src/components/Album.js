import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getArtists, getSettings } from '../selectors';
import { mergeAlbumArtists } from '../helpers';
import Link from './Link';

function Album(album) {
  const { uri, url, image, name } = album;
  const { covers } = useSelector(getSettings);
  const artistsMap = useSelector(getArtists);
  const artistsToDisplay = mergeAlbumArtists(album, artistsMap)
    .map((artist) => (
      <Link uri={artist.uri} url={artist.url} className="has-text-light" key={artist.id}>
        {artist.name}
      </Link>
    ))
    .reduce((acc, node) => [acc, ', ', node]);

  return (
    <article className="Album media">
      {covers && (
        <Link uri={uri} url={url} className="media-left">
          <figure className="image is-64x64">
            <img src={image} alt={name} />
          </figure>
        </Link>
      )}
      <div className="media-content has-text-light">
        <div className="content">
          <Link uri={uri} url={url} className="is-size-5">
            {name}
          </Link>
          <br />
          {artistsToDisplay}
        </div>
      </div>
    </article>
  );
}

Album.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired,
  groups: PropTypes.object.isRequired,
};

export default Album;
