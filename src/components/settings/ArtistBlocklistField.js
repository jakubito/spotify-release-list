import { useDispatch, useSelector } from 'react-redux'
import { defer } from 'helpers'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import HelpText from './HelpText'

function ArtistBlocklistField() {
  const { artistBlocklist } = useSelector(getSettings)
  const dispatch = useDispatch()

  return (
    <div className="ArtistBlocklistField Settings__field field">
      <label className="label has-text-light">Artist blocklist</label>
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
          per line. Artists will be automatically blocked on every refresh.
        </HelpText>
      </div>
      <div className="control">
        <textarea
          className="textarea is-dark"
          placeholder="Example:&#10;fHCAxkS9oIpI7xX449YAfA&#10;wDiv3aKBnh9MVsQhxlI0EQ"
          rows={6}
          defaultValue={artistBlocklist}
          onChange={(event) =>
            defer(dispatch, setSettings({ artistBlocklist: event.target.value }))
          }
        />
      </div>
    </div>
  )
}

export default ArtistBlocklistField
