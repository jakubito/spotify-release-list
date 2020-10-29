import React from 'react'
import { useSelector } from 'react-redux'
import { getSettingsCovers } from 'selectors'
import { getSpotifyUri, getSpotifyUrl } from 'helpers'
import { SpotifyEntity } from 'enums'
import Link from './Link'

/**
 * Render single album
 *
 * @param {{ album: AlbumGrouped }} props
 */
function Album({ album }) {
  const { id, name } = album

  return (
    <article className="Album media">
      <AlbumCover album={album} />
      <div className="media-content has-text-light">
        <div className="content">
          <Link
            title={name}
            uri={getSpotifyUri(id, SpotifyEntity.ALBUM)}
            url={getSpotifyUrl(id, SpotifyEntity.ALBUM)}
            className="title is-size-5"
          >
            {name}
          </Link>
          <AlbumArtists album={album} />
        </div>
      </div>
    </article>
  )
}

/** @param {{ album: AlbumGrouped }} props */
function AlbumCover({ album }) {
  const { id, image, name } = album
  const covers = useSelector(getSettingsCovers)

  if (!covers) {
    return null
  }

  return (
    <Link
      title={name}
      uri={getSpotifyUri(id, SpotifyEntity.ALBUM)}
      url={getSpotifyUrl(id, SpotifyEntity.ALBUM)}
      className="media-left"
    >
      <figure className="image">
        <img src={image} alt={name} />
      </figure>
    </Link>
  )
}

/** @param {{ artist: Artist, className: string }} props */
function ArtistLink({ artist, className }) {
  const { id, name } = artist

  return (
    <Link
      title={name}
      uri={getSpotifyUri(id, SpotifyEntity.ARTIST)}
      url={getSpotifyUrl(id, SpotifyEntity.ARTIST)}
      className={className}
      key={id}
    >
      {name}
    </Link>
  )
}

/** @param {{ album: AlbumGrouped }} props */
function AlbumArtists({ album }) {
  const primary = album.primaryArtists.map((artist) => (
    <ArtistLink artist={artist} className="has-text-light" key={artist.id} />
  ))

  const other = album.artists.map((artist) => (
    <ArtistLink artist={artist} className="has-text-grey" key={artist.id} />
  ))

  return (
    <div className="artists has-text-grey">
      {[...primary, ...other].reduce((artists, artist) => (
        <>
          {artists}, {artist}
        </>
      ))}
    </div>
  )
}

export default Album
