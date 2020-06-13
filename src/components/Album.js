import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getArtists, getSettingsCovers } from 'selectors';
import { mergeAlbumArtists } from 'helpers';
import Link from './Link';

function AlbumCover({ album }) {
  const { uri, url, image, name } = album;
  const covers = useSelector(getSettingsCovers);

  if (!covers) {
    return null;
  }

  return (
    <Link title={name} uri={uri} url={url} className="media-left">
      <figure className="image">
        <img src={image} alt={name} />
      </figure>
    </Link>
  );
}

function AlbumArtists({ album }) {
  const artistsMap = useSelector(getArtists);
  const artists = mergeAlbumArtists(album, artistsMap);

  return (
    <div className="artists">
      {artists
        .map((artist) => (
          <Link
            title={artist.name}
            uri={artist.uri}
            url={artist.url}
            className="has-text-light"
            key={artist.id}
          >
            {artist.name}
          </Link>
        ))
        .reduce((acc, node) => [acc, ', ', node])}
    </div>
  );
}

function Album({ album }) {
  const { uri, url, name } = album;

  return (
    <article className="Album media">
      <AlbumCover album={album} />
      <div className="media-content has-text-light">
        <div className="content">
          <Link title={name} uri={uri} url={url} className="title is-size-5">
            {name}
          </Link>
          <AlbumArtists album={album} />
        </div>
      </div>
    </article>
  );
}

Album.propTypes = {
  album: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    artists: PropTypes.array.isRequired,
    groups: PropTypes.object.isRequired,
  }).isRequired,
};

export default Album;
