import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { sleep } from 'helpers'
import { getSettings } from 'state/selectors'
import { Button } from 'components/common'

/**
 * Render current settings as JSON
 *
 * @param {{ serialize: SettingsSerializer }} props
 */
function CurrentSettingsField({ serialize }) {
  /** @type {React.MutableRefObject<HTMLTextAreaElement>} */
  const textareaRef = useRef()
  const settings = useSelector(getSettings)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(textareaRef.current?.value)
    setCopied(true)
    sleep(1200).then(() => setCopied(false))
  }

  return (
    <div className="CurrentSettingsField Settings__field field">
      <label className="label has-text-light">Current settings</label>
      <div className="control">
        <textarea
          ref={textareaRef}
          value={serialize(settings)}
          className="BackupSettings__textarea textarea is-dark is-family-code"
          rows={8}
          readOnly
        />
      </div>
      <Button
        title={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        icon={copied ? 'fas fa-check-circle' : 'fas fa-copy'}
        className="BackupSettings__button"
        disabled={copied}
        onClick={copy}
      />
    </div>
  )
}

export default CurrentSettingsField
