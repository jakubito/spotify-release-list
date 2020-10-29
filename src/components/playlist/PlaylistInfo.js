import React from 'react'
import { useSelector } from 'react-redux'
import { getCreatingPlaylist, getPlaylistForm, getPlaylistId } from 'selectors'
import { getSpotifyUri, getSpotifyUrl } from 'helpers'
import { SpotifyEntity } from 'enums'
import Link from 'components/Link'

/**
 * Render playlist creation result
 */
function PlaylistInfo() {
  const creatingPlaylist = useSelector(getCreatingPlaylist)

  return (
    <div className="PlaylistInfo has-text-light">{creatingPlaylist ? <Creating /> : <Info />}</div>
  )
}

function Creating() {
  return (
    <>
      <progress className="progress is-small" />
      Creating playlist, please wait...
    </>
  )
}

function Info() {
  const { name } = useSelector(getPlaylistForm)
  const id = useSelector(getPlaylistId)

  return (
    <>
      <span className="icon is-large">
        <i className="far fa-check-circle fa-2x" />
      </span>
      Playlist created
      <Link
        title={name}
        uri={getSpotifyUri(id, SpotifyEntity.PLAYLIST)}
        url={getSpotifyUrl(id, SpotifyEntity.PLAYLIST)}
        className="is-size-5"
      >
        {name}
      </Link>
    </>
  )
}

export default PlaylistInfo
