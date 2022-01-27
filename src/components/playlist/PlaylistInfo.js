import { useSelector } from 'react-redux'
import { spotifyLink } from 'helpers'
import { SpotifyEntity } from 'enums'
import { getPlaylistForm, getPlaylistId, getSettingsUriLinks } from 'state/selectors'
import { Button, ButtonAnchor } from 'components/common'

const { PLAYLIST } = SpotifyEntity

/**
 * Render playlist creation result
 *
 * @param {{ closeModal: () => void }} props
 */
function PlaylistInfo({ closeModal }) {
  const { name } = useSelector(getPlaylistForm)
  const id = useSelector(getPlaylistId)
  const uriLinks = useSelector(getSettingsUriLinks)

  return (
    <>
      <div className="PlaylistInfo has-text-light">
        <span className="icon is-large">
          <i className="far fa-check-circle fa-2x" />
        </span>
        Playlist created
        <ButtonAnchor
          title={name}
          href={spotifyLink(id, PLAYLIST, uriLinks)}
          className="PlaylistInfo__link"
          text
        >
          {name}
        </ButtonAnchor>
      </div>
      <div className="actions">
        <Button title="Close" icon="fas fa-times" onClick={closeModal} />
      </div>
    </>
  )
}

export default PlaylistInfo
