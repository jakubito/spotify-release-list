import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { getAlbums } from 'state/selectors'

/**
 * Render album's full title and all artists
 *
 * @param {{ id: string }} props
 */
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

export default memo(AlbumFullTitle)
