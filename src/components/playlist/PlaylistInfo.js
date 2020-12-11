import { useSelector } from 'react-redux'
import { spotifyUri, spotifyUrl } from 'helpers'
import { SpotifyEntity } from 'enums'
import { getPlaylistForm, getPlaylistId } from 'state/selectors'
import { Link, Button } from 'components/common'

/**
 * Render playlist creation result
 *
 * @param {{ closeModal: () => void }} props
 */
function PlaylistInfo({ closeModal }) {
  const { name } = useSelector(getPlaylistForm)
  const id = useSelector(getPlaylistId)

  return (
    <>
      <div className="PlaylistInfo has-text-light">
        <span className="icon is-large">
          <i className="far fa-check-circle fa-2x" />
        </span>
        Playlist created
        <Link
          title={name}
          uri={spotifyUri(id, SpotifyEntity.PLAYLIST)}
          url={spotifyUrl(id, SpotifyEntity.PLAYLIST)}
          className="is-size-5"
        >
          {name}
        </Link>
      </div>
      <div className="actions">
        <Button title="Close" icon="fas fa-times" onClick={closeModal} />
      </div>
    </>
  )
}

export default PlaylistInfo
