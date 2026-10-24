import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { defer, sleep } from 'helpers'
import { getLabelBlocklistHeight, getSettings, getSettingsBlockedLabels } from 'state/selectors'
import { applyLabelBlocklist, setLabelBlocklistHeight, setSettings } from 'state/actions'
import { Button } from 'components/common'
import HelpText from './HelpText'
import ExtraDataRequiredLink from './ExtraDataRequiredLink'

/**
 * Render label blocklist field
 */
function LabelBlocklistField() {
  const { fullAlbumData, labelBlocklist } = useSelector(getSettings)
  const entries = useSelector(getSettingsBlockedLabels)
  const entriesLength = Object.keys(entries).length
  const height = useSelector(getLabelBlocklistHeight)
  const dispatch = useDispatch()
  const [applied, setApplied] = useState(false)
  /** @type {React.RefObject<HTMLTextAreaElement | null>} */
  const textareaRef = useRef(null)

  const apply = () => {
    defer(dispatch, applyLabelBlocklist())
    setApplied(true)
    sleep(1200).then(() => setApplied(false))
  }

  useEffect(() => {
    if (!window.ResizeObserver) return

    const callback = debounce(() => {
      const height = textareaRef.current?.offsetHeight
      if (height) dispatch(setLabelBlocklistHeight(height))
    }, 300)

    const observer = new ResizeObserver(callback)
    if (textareaRef.current) observer.observe(textareaRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="LabelBlocklistField Settings__field field">
      <label className="label has-text-light">
        Label blocklist {entriesLength > 0 ? `(${entriesLength})` : ''}
        {!fullAlbumData && <ExtraDataRequiredLink>Label data required</ExtraDataRequiredLink>}
      </label>
      <div className="Settings__help">
        <HelpText>
          Enter one label per line. Prefix a label with <strong>*VA*</strong> to block only its
          Various Artists releases. Labels are blocked automatically on every refresh, or you can
          apply the list manually.
        </HelpText>
      </div>
      <div className="control">
        <textarea
          className="textarea is-dark"
          placeholder="Example:&#10;UME - Global Clearing House&#10;*VA* UME - Global Clearing House"
          rows={6}
          defaultValue={labelBlocklist}
          disabled={!fullAlbumData}
          onChange={(event) => defer(dispatch, setSettings({ labelBlocklist: event.target.value }))}
          style={{ height: height ?? undefined }}
          ref={textareaRef}
        />
      </div>
      <Button
        title={applied ? 'Labels blocked' : 'Block labels now'}
        icon={applied ? 'fas fa-check-circle' : undefined}
        disabled={applied || !fullAlbumData}
        onClick={apply}
        small
      />
    </div>
  )
}

export default LabelBlocklistField
