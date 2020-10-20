import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getAlbums } from 'selectors'

function AlbumFullTitle({ id }) {
  const albums = useSelector(getAlbums)
  const album = albums[id]
  const artists = [...album.primaryArtists, ...album.artists]
    .map((artist) => artist.name)
    .join(', ')

  return (
    <span className="AlbumFullTitle">
      {album.name}
      <span className="has-text-weight-normal is-italic"> - {artists}</span>
    </span>
  )
}

AlbumFullTitle.propTypes = {
  id: PropTypes.string.isRequired,
}

export default memo(AlbumFullTitle)
