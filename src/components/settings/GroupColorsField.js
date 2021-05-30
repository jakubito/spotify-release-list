import { useSelector, useDispatch } from 'react-redux'
import { getSettingsGroupColors } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Input } from 'components/common'

/**
 * Render group colors field
 */
function GroupColorsField() {
  const groupColors = useSelector(getSettingsGroupColors)
  const dispatch = useDispatch()

  return (
    <div className="GroupColorsField Settings__field field">
      <label className="label has-text-light">Release title colors</label>
      <div className="control">
        <div className="field">
          <Input />
        </div>
      </div>
    </div>
  )
}

export default GroupColorsField
