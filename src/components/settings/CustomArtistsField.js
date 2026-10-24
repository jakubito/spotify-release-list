import { useDispatch, useSelector } from 'react-redux'
import { defer } from 'helpers'
import { ArtistSource } from 'enums'
import {
  getSettingsArtistSources,
  getSettingsCustomArtistIds,
  getSettingsCustomArtists,
} from 'state/selectors'
import { setSettings } from 'state/actions'
import HelpText from './HelpText'

function CustomArtistsField() {
  const artistSources = useSelector(getSettingsArtistSources)
  const customArtists = useSelector(getSettingsCustomArtists)
  const entries = useSelector(getSettingsCustomArtistIds)
  const dispatch = useDispatch()

  if (!artistSources.includes(ArtistSource.CUSTOM)) return null

  return (
    <div className="CustomArtistsField Settings__field field">
      <label className="label has-text-light">
        Custom artists {entries.length > 0 ? `(${entries.length})` : ''}
      </label>
      <div className="Settings__help">
        <HelpText>
          Enter one{' '}
          <a
            href="https://www.google.com/search?q=how+to+find+spotify+artist+id"
            title='Google "how to find spotify artist id"'
            target="_blank"
            rel="noopener noreferrer"
          >
            Artist ID
          </a>{' '}
          per line.
        </HelpText>
      </div>
      <div className="control">
        <textarea
          className="textarea is-dark"
          placeholder="Example:&#10;fHCAxkS9oIpI7xX449YAfA&#10;wDiv3aKBnh9MVsQhxlI0EQ"
          rows={6}
          defaultValue={customArtists}
          onChange={(event) => defer(dispatch, setSettings({ customArtists: event.target.value }))}
        />
      </div>
    </div>
  )
}

export default CustomArtistsField
