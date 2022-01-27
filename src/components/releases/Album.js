import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { getEditingFavorites, getFavorites, getSettings } from 'state/selectors'
import { setFavorite } from 'state/actions'
import { defer, spotifyLink } from 'helpers'
import { SpotifyEntity } from 'enums'
import { Anchor, Checkbox } from 'components/common'

const { ALBUM, ARTIST } = SpotifyEntity

/**
 * Render individual album
 *
 * @param {{ album: Album }} props
 */
function Album({ album }) {
  const { id, name, image, artists, totalTracks } = album
  const dispatch = useDispatch()
  const { groupColors, covers, uriLinks, displayTracks } = useSelector(getSettings)
  const favorites = useSelector(getFavorites)
  const editingFavorites = useSelector(getEditingFavorites)
  const [checked, setChecked] = useState(Boolean(favorites[id]))
  const link = spotifyLink(id, ALBUM, uriLinks)
  const mainGroup = Object.keys(artists).shift()

  /** @type {React.MouseEventHandler<HTMLDivElement>} */
  function favoriteClickHandler(event) {
    if (!editingFavorites) return

    setChecked(!checked)
    defer(dispatch, setFavorite({ id, selected: !checked }))
    event.preventDefault()
  }

  useEffect(() => {
    setChecked(Boolean(favorites[id]))
  }, [favorites])

  return (
    <article className="Album media" key={id}>
      <div
        className={classNames('Album__left media-left', { 'Album__left--edit': editingFavorites })}
        onClick={favoriteClickHandler}
      >
        {editingFavorites && (
          <Checkbox
            id={`album-favorite-${id}`}
            labelClassName="Album__favorite-checkbox-label"
            checked={checked}
            readOnly
            dark
          />
        )}
        {covers && (
          <Anchor title={name} href={link} className="Album__cover">
            <figure className="Album__figure">
              <img src={image} alt={name} className="Album__image" crossOrigin="anonymous" />
            </figure>
          </Anchor>
        )}
      </div>
      <div className="Album__content media-content">
        <div className="Album__title-row">
          <Anchor title={name} href={link} color={groupColors[mainGroup]} className="Album__title">
            {name}
          </Anchor>
          {displayTracks && <span className="Album__tracks">{totalTracks}</span>}
        </div>
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

export default Album
