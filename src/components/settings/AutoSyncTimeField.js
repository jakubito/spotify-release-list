import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Input } from 'components/common'
import HelpText from './HelpText'

/**
 * Render auto sync time field
 */
function AutoSyncField() {
  const { autoSync, autoSyncTime } = useSelector(getSettings)
  const dispatch = useDispatch()

  return (
    <div className="AutoSyncField Settings__field field">
      <label className="label has-text-light" htmlFor="autoSyncTime">
        Trigger at <HelpText>(approximately)</HelpText>
      </label>
      <div className="control">
        <div className="field">
          <Input
            id="autoSyncTime"
            type="time"
            defaultValue={autoSyncTime}
            disabled={!autoSync}
            onChange={(event) => defer(dispatch, setSettings({ autoSyncTime: event.target.value }))}
          />
        </div>
      </div>
    </div>
  )
}

export default AutoSyncField
