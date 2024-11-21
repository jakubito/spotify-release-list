import { useSelector } from 'react-redux'
import { spotifyLink } from 'helpers'
import { SpotifyEntity } from 'enums'
import { getSettingsUriLinks } from 'state/selectors'
import { Button, ButtonAnchor } from 'components/common'

const { PLAYLIST } = SpotifyEntity

/**
 * Render playlist export result
 *
 * @param {{ title: string, playlist: Playlist, close: () => void }} props
 */
function PlaylistInfo({ title, playlist, close }) {
  const uriLinks = useSelector(getSettingsUriLinks)

  return (
    <>
      <div className="PlaylistInfo has-text-light">
        <span className="icon is-large">
          <i className="fas fa-check-circle fa-2x" />
        </span>
        {title}
        <ButtonAnchor
          title={playlist.name}
          icon="fas fa-arrow-up-right-from-square"
          href={spotifyLink(playlist.id, PLAYLIST, uriLinks)}
          className="PlaylistInfo__link"
          text
        >
          {playlist.name}
        </ButtonAnchor>
      </div>
      <div className="actions">
        <Button title="Close" onClick={close} />
      </div>
    </>
  )
}

export default PlaylistInfo
