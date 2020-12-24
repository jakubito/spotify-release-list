import { useSelector } from 'react-redux'
import { getSettingsCovers } from 'state/selectors'
import { spotifyUri, spotifyUrl } from 'helpers'
import { SpotifyEntity } from 'enums'
import { Link } from 'components/common'

const { ALBUM, ARTIST } = SpotifyEntity

/**
 * Render single album
 *
 * @param {{ album: Album }} props
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
            uri={spotifyUri(id, ALBUM)}
            url={spotifyUrl(id, ALBUM)}
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

/** @param {{ album: Album }} props */
function AlbumCover({ album }) {
  const { id, image, name } = album
  const covers = useSelector(getSettingsCovers)

  if (!covers) {
    return null
  }

  return (
    <Link
      title={name}
      uri={spotifyUri(id, ALBUM)}
      url={spotifyUrl(id, ALBUM)}
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
      uri={spotifyUri(id, ARTIST)}
      url={spotifyUrl(id, ARTIST)}
      className={className}
      key={id}
    >
      {name}
    </Link>
  )
}

/** @param {{ album: Album }} props */
function AlbumArtists({ album }) {
  const primary = Object.values(album.artists)
    .flat()
    .map((artist) => (
      <ArtistLink artist={artist} className="has-text-grey-lighter" key={artist.id} />
    ))

  const other = album.otherArtists.map((artist) => (
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
