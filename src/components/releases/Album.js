import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { getEditingFavorites, getFavorites, getSettings } from 'state/selectors'
import { setFavorite } from 'state/actions'
import { defer, spotifyLink } from 'helpers'
import { SpotifyEntity } from 'enums'
import { Anchor, Checkbox } from 'components/common'
import LabelDropdown from './LabelDropdown'

const { ALBUM, ARTIST } = SpotifyEntity

/**
 * Render individual album
 *
 * @param {{ album: Album }} props
 */
function Album({ album }) {
  const { id, name, image, artists, totalTracks, label, popularity } = album
  const dispatch = useDispatch()
  const { groupColors, covers, uriLinks, displayLabels, displayPopularity, displayTracks } =
    useSelector(getSettings)
  const favorites = useSelector(getFavorites)
  const editingFavorites = useSelector(getEditingFavorites)
  const [favoriteLocal, setFavoriteLocal] = useState(Boolean(favorites[id]))
  const link = spotifyLink(id, ALBUM, uriLinks)
  const mainGroup = Object.keys(artists).shift()

  /** @type {React.MouseEventHandler<HTMLDivElement>} */
  function favoriteClickHandler(event) {
    if (!editingFavorites) return

    setFavoriteLocal(!favoriteLocal)
    defer(dispatch, setFavorite({ id, selected: !favoriteLocal }))
    event.preventDefault()
  }

  useEffect(() => {
    setFavoriteLocal(Boolean(favorites[id]))
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
            checked={favoriteLocal}
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
      <div className="Album__content">
        <div className="Album__title-row">
          <Anchor title={name} href={link} color={groupColors[mainGroup]} className="Album__title">
            {name}
          </Anchor>
        </div>
        {renderArtists({ album, uriLinks })}
        <div className="Album__meta-row">
          {displayLabels && label && <LabelDropdown label={label} />}
          {displayPopularity && Number.isInteger(popularity) && (
            <div className="Album__meta " title="Popularity">
              <i className="Album__popularity-icon fas fa-chart-line" />
              {popularity}
            </div>
          )}
          {displayTracks && (
            <div className="Album__meta">
              {totalTracks}&nbsp;{totalTracks > 1 ? 'tracks' : 'track'}
            </div>
          )}
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
  const primaryArtists = [...new Set(Object.values(album.artists).flat())]

  const uniquePrimaryArtists = [
    ...new Map(primaryArtists.map((artist) => [artist['id'], artist])).values(),
  ]

  const primary = uniquePrimaryArtists.map((artist) =>
    renderArtist({ artist, uriLinks, className: 'Album__artist' })
  )
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
