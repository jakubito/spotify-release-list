import { useSelector, useDispatch } from 'react-redux'
import { getSettingsUriLinks } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import HelpText from './HelpText'

/**
 * Render URI / URL links field
 */
function UriLinksField() {
  const uriLinks = useSelector(getSettingsUriLinks)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const newUriLinks = Boolean(Number(event.target.value))

    defer(dispatch, setSettings({ uriLinks: newUriLinks }))
  }

  return (
    <div className="UriLinksField Settings__field field">
      <label className="label has-text-light">
        Open links in <HelpText>/ URL or URI</HelpText>
      </label>
      <div className="control">
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="uriLinksFalse"
            type="radio"
            name="uriLinks"
            value="0"
            defaultChecked={!uriLinks}
            onChange={onChange}
          />
          <label htmlFor="uriLinksFalse">New tab</label>
        </div>
        <div className="field">
          <input
            className="is-checkradio has-background-color is-white"
            id="uriLinksTrue"
            type="radio"
            name="uriLinks"
            value="1"
            defaultChecked={uriLinks}
            onChange={onChange}
          />
          <label htmlFor="uriLinksTrue">Spotify app</label>
        </div>
      </div>
    </div>
  )
}

export default UriLinksField
