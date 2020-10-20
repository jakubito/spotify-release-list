import React from 'react'
import { useSelector } from 'react-redux'
import { getCreatingPlaylist, getPlaylistForm, getPlaylistId } from 'selectors'
import { getSpotifyUri, getSpotifyUrl } from 'helpers'
import { SpotifyEntity } from 'enums'
import Link from 'components/Link'

function Creating() {
  return (
    <>
      <progress className="progress is-small"></progress>
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
        <i className="far fa-check-circle fa-2x"></i>
      </span>
      Playlist created
      <Link
        uri={getSpotifyUri(id, SpotifyEntity.PLAYLIST)}
        url={getSpotifyUrl(id, SpotifyEntity.PLAYLIST)}
        className="is-size-5"
      >
        {name}
      </Link>
    </>
  )
}

function PlaylistInfo() {
  const creatingPlaylist = useSelector(getCreatingPlaylist)

  return (
    <div className="PlaylistInfo has-text-light">{creatingPlaylist ? <Creating /> : <Info />}</div>
  )
}

export default PlaylistInfo
