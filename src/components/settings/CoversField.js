import { useSelector, useDispatch } from 'react-redux'
import { getSettingsCovers } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Checkbox } from 'components/common'
import HelpText from './HelpText'

/**
 * Render album covers toggle field
 */
function CoversField() {
  const covers = useSelector(getSettingsCovers)
  const dispatch = useDispatch()

  return (
    <div className="CoversField Settings__field field">
      <label className="label has-text-light">
        Album covers <HelpText>/ turn off to use less data</HelpText>
      </label>
      <div className="control">
        <div className="field">
          <Checkbox
            id="covers"
            label="Display album covers"
            defaultChecked={covers}
            onChange={(event) => defer(dispatch, setSettings({ covers: event.target.checked }))}
          />
        </div>
      </div>
    </div>
  )
}

export default CoversField
