import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import { defer, sleep } from 'helpers'
import { useFeature } from 'hooks'
import { getLabelBlocklistHeight, getSettings } from 'state/selectors'
import { applyLabelBlocklist, setLabelBlocklistHeight, setSettings } from 'state/actions'
import { Button } from 'components/common'
import HelpText from './HelpText'

/**
 * Render label blocklist field
 */
function LabelBlocklistField() {
  const { fullAlbumData, labelBlocklist } = useSelector(getSettings)
  const height = useSelector(getLabelBlocklistHeight)
  const dispatch = useDispatch()
  const [applied, setApplied] = useState(false)
  /** @type {React.MutableRefObject<HTMLTextAreaElement>} */
  const textareaRef = useRef()
  const { seen: labelsFeatureSeen } = useFeature('labels')

  const apply = () => {
    defer(dispatch, applyLabelBlocklist())
    setApplied(true)
    sleep(1200).then(() => setApplied(false))
  }

  useEffect(() => {
    const callback = debounce(() => {
      const height = textareaRef.current?.offsetHeight
      if (height) dispatch(setLabelBlocklistHeight(height))
    }, 300)

    const observer = new ResizeObserver(callback)
    observer.observe(textareaRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="LabelBlocklistField Settings__field field">
      <label className="label has-text-light">
        Label blocklist
        {!labelsFeatureSeen && <div className="badge badge--inline badge--primary">NEW</div>}
        {!fullAlbumData && <span className="tag is-warning">Label data required</span>}
      </label>
      <div className="LabelBlocklistField__help">
        <HelpText>
          One label per line. Labels will be automatically blocked on every refresh. You can also
          apply the list manually.
        </HelpText>
      </div>
      <div className="control">
        <textarea
          className="textarea is-dark"
          rows={6}
          defaultValue={labelBlocklist}
          onChange={(event) => defer(dispatch, setSettings({ labelBlocklist: event.target.value }))}
          style={{ height }}
          ref={textareaRef}
        />
      </div>
      <Button
        title={applied ? 'Labels blocked' : 'Block labels now'}
        icon={applied ? 'fas fa-check-circle' : 'fas fa-skull'}
        disabled={applied}
        onClick={apply}
      />
    </div>
  )
}

export default LabelBlocklistField
