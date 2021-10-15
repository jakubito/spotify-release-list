import { memo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import {
  getPreviousSyncMaxDate,
  getSettingsCovers,
  getSettingsGroupColors,
  getSettingsUriLinks,
} from 'state/selectors'
import { spotifyLink } from 'helpers'
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
  const groupColors = useSelector(getSettingsGroupColors)
  const covers = useSelector(getSettingsCovers)
  const uriLinks = useSelector(getSettingsUriLinks)

  return (
    <div className="ReleaseDay columns is-gapless">
      <div className="ReleaseDay__date column">
        {previousSyncMaxDate && date > previousSyncMaxDate && (
          <span className="ReleaseDay__bullet icon">
            <i className="fas fa-circle" />
          </span>
        )}
        {moment(date).format('MMMM D')}
      </div>
      <div className="ReleaseDay__albums column">
        {albums.map((album) => renderAlbum({ album, groupColors, covers, uriLinks }))}
      </div>
    </div>
  )
}

/**
 * Render individual album
 *
 * @param {{
 *   album: Album
 *   groupColors: GroupColorScheme
 *   covers: boolean
 *   uriLinks: boolean
 * }} props
 */
function renderAlbum({ album, groupColors, covers, uriLinks }) {
  const { id, name, image, artists } = album
  const link = spotifyLink(id, ALBUM, uriLinks)
  const mainGroup = Object.keys(artists).shift()

  return (
    <article className="Album media" key={id}>
      {covers && (
        <Anchor title={name} href={link} className="Album__cover media-left">
          <figure className="Album__figure">
            <img src={image} alt={name} className="Album__image" crossOrigin="anonymous" />
          </figure>
        </Anchor>
      )}
      <div className="media-content">
        <Anchor title={name} href={link} color={groupColors[mainGroup]} className="Album__title">
          {name}
        </Anchor>
        {renderArtists({ album, uriLinks })}
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
    .map((artist) => renderArtist({ artist, uriLinks, className: 'Album__artist' }))
  const other = album.otherArtists.map((artist) =>
    renderArtist({ artist, uriLinks, className: 'Album__artist Album__artist--other' })
  )

  return (
    <div className="Album__artists">
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

  return (
    <Anchor title={name} href={spotifyLink(id, ARTIST, uriLinks)} className={className} key={id}>
      {name}
    </Anchor>
  )
}

export default memo(ReleaseDay)
