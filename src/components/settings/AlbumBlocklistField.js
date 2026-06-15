import { useDispatch, useSelector } from 'react-redux'
import { defer } from 'helpers'
import { getSettingsAlbumBlocklist, getSettingsBlockedAlbums } from 'state/selectors'
import { setSettings } from 'state/actions'
import HelpText from './HelpText'

function AlbumBlocklistField() {
  const albumBlocklist = useSelector(getSettingsAlbumBlocklist)
  const entries = useSelector(getSettingsBlockedAlbums)
  const dispatch = useDispatch()

  return (
    <div className="AlbumBlocklistField Settings__field field">
      <label className="label has-text-light">
        Album blocklist {entries.length > 0 ? `(${entries.length})` : ''}
      </label>
      <div className="Settings__help">
        <HelpText>
          Enter one definition per line. Accepts regular expressions, matching is case-insensitive.
          Albums whose name matches any pattern will be automatically blocked on every refresh.
        </HelpText>
      </div>
      <div className="control">
        <textarea
          className="textarea is-dark"
          rows={6}
          defaultValue={albumBlocklist}
          onChange={(event) => defer(dispatch, setSettings({ albumBlocklist: event.target.value }))}
        />
      </div>
    </div>
  )
}

export default AlbumBlocklistField
