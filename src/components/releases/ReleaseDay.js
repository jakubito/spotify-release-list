import { memo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { getPreviousSyncMaxDate, getSettingsCovers, getSettingsUriLinks } from 'state/selectors'
import { spotifyUri, spotifyUrl } from 'helpers'
import { SpotifyEntity } from 'enums'
import { Anchor } from 'components/common'

const { ALBUM, ARTIST } = SpotifyEntity

/**
 * Render single release day
 *
 * @param {{ date: string, albums: Album[] }} props
 */
function ReleaseDay({ date, albums }) {
  const previousSyncMaxDate = useSelector(getPreviousSyncMaxDate)
  const covers = useSelector(getSettingsCovers)
  const uriLinks = useSelector(getSettingsUriLinks)

  return (
    <div className="ReleaseDay columns is-gapless">
      <div className="column is-size-4 date">
        {previousSyncMaxDate && date > previousSyncMaxDate && <span className="new">• </span>}
        {moment(date).format('MMMM D')}
      </div>
      <div className="column albums">
        {albums.map((album) => renderAlbum({ album, covers, uriLinks }))}
      </div>
    </div>
  )
}

/**
 * Render individual album
 *
 * @param {{ album: Album, covers: boolean, uriLinks: boolean }} props
 */
function renderAlbum({ album, covers, uriLinks }) {
  const { id, name, image } = album
  const link = uriLinks ? spotifyUri(id, ALBUM) : spotifyUrl(id, ALBUM)

  return (
    <article className="Album media" key={id}>
      {covers && (
        <Anchor title={name} href={link} className="media-left">
          <figure className="image">
            <img src={image} alt={name} />
          </figure>
        </Anchor>
      )}
      <div className="media-content has-text-light">
        <div className="content">
          <Anchor title={name} href={link} className="title is-size-5">
            {name}
          </Anchor>
          {renderArtists({ album, uriLinks })}
        </div>
      </div>
    </article>
  )
}

/**
 * Render artists
 *
 * @param {{ album: Album, uriLinks: boolean }} props
 */
function renderArtists({ album, uriLinks }) {
  const primary = Object.values(album.artists)
    .flat()
    .map((artist) => renderArtist({ artist, uriLinks, className: 'has-text-grey-lighter' }))
  const other = album.otherArtists.map((artist) =>
    renderArtist({ artist, uriLinks, className: 'has-text-grey' })
  )

  return (
    <div className="artists has-text-grey">
      {primary.concat(other).reduce((artists, artist) => (
        <>
          {artists}, {artist}
        </>
      ))}
    </div>
  )
}

/**
 * Render artist link
 *
 * @param {{ artist: Artist, className: string, uriLinks: boolean }} props
 */
function renderArtist({ artist, uriLinks, className }) {
  const { id, name } = artist
  const link = uriLinks ? spotifyUri(id, ARTIST) : spotifyUrl(id, ARTIST)

  return (
    <Anchor title={name} href={link} className={className} key={id}>
      {name}
    </Anchor>
  )
}

export default memo(ReleaseDay)
