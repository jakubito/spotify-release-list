import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getSettings } from 'state/selectors'
import { Button } from 'components/common'

/**
 * Render current settings as JSON
 *
 * @param {RouteComponentProps & { serialize: SettingsSerializer }} props
 */
function CurrentSettingsField({ serialize }) {
  /** @type {React.MutableRefObject<HTMLTextAreaElement>} */
  const textareaRef = useRef()
  const settings = useSelector(getSettings)

  const copy = () => {
    textareaRef.current?.select()
    document.execCommand('copy')
  }

  return (
    <div className="CurrentSettingsField Settings__field field">
      <label className="label has-text-light">Current settings</label>
      <div className="control">
        <textarea
          ref={textareaRef}
          value={serialize(settings)}
          className="BackupSettings__textarea textarea is-dark is-family-code"
          rows={6}
          readOnly
        />
      </div>
      <Button
        title="Copy to clipboard"
        className="BackupSettings__button"
        icon="fas fa-copy"
        onClick={copy}
      />
    </div>
  )
}

export default CurrentSettingsField
