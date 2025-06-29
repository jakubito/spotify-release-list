import { useSelector } from 'react-redux'
import moment from 'moment'
import { spotifyLink } from 'helpers'
import { SpotifyEntity } from 'enums'
import { getSettingsUriLinks } from 'state/selectors'
import { Anchor } from 'components/common'

const { ALBUM, ARTIST } = SpotifyEntity

/**
 * Display individual album from label search
 */
function LabelAlbum({ album }) {
  const uriLinks = useSelector(getSettingsUriLinks)
  
  const albumLink = spotifyLink(album.id, ALBUM, uriLinks)
  const releaseYear = moment(album.release_date).format('YYYY')
  const image = album.images?.[0]?.url

  return (
    <article className="LabelAlbum">
      <div className="LabelAlbum__cover">
        <Anchor title={album.name} href={albumLink}>
          <figure className="LabelAlbum__figure">
            {image ? (
              <img 
                src={image} 
                alt={album.name} 
                className="LabelAlbum__image" 
                crossOrigin="anonymous" 
              />
            ) : (
              <div className="LabelAlbum__placeholder">
                <i className="fas fa-music" />
              </div>
            )}
          </figure>
        </Anchor>
      </div>

      <div className="LabelAlbum__content">
        <div className="LabelAlbum__title">
          <Anchor title={album.name} href={albumLink} className="LabelAlbum__title-link">
            {album.name}
          </Anchor>
        </div>

        <div className="LabelAlbum__artists">
          {album.artists.map((artist, index) => (
            <span key={artist.id}>
              <Anchor 
                title={artist.name} 
                href={spotifyLink(artist.id, ARTIST, uriLinks)}
                className="LabelAlbum__artist"
              >
                {artist.name}
              </Anchor>
              {index < album.artists.length - 1 && ', '}
            </span>
          ))}
        </div>

        <div className="LabelAlbum__meta">
          <span className="LabelAlbum__year">{releaseYear}</span>
          <span className="LabelAlbum__type">{album.album_type}</span>
          <span className="LabelAlbum__tracks">{album.total_tracks} tracks</span>
        </div>
      </div>
    </article>
  )
}

export default LabelAlbum