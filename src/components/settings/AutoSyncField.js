import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Checkbox } from 'components/common'

/**
 * Render auto sync field
 */
function AutoSyncField() {
  const { autoSync } = useSelector(getSettings)
  const dispatch = useDispatch()

  return (
    <div className="AutoSyncField Settings__field field">
      <label className="label has-text-light" htmlFor="autoSync">
        Background refresh
      </label>
      <div className="control">
        <div className="field">
          <Checkbox
            id="autoSync"
            label="Refresh automatically every day"
            defaultChecked={autoSync}
            onChange={(event) => defer(dispatch, setSettings({ autoSync: event.target.checked }))}
          />
        </div>
      </div>
    </div>
  )
}

export default AutoSyncField
