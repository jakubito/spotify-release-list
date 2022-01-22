import { useSelector, useDispatch } from 'react-redux'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import { Checkbox } from 'components/common'

/**
 * Render album track count toggle field
 */
function DisplayTracksField() {
  const { displayTracks } = useSelector(getSettings)
  const dispatch = useDispatch()

  return (
    <div className="DisplayTracksField Settings__field field">
      <label className="label has-text-light" htmlFor="displayTracks">
        Album track count
      </label>
      <div className="control">
        <div className="field">
          <Checkbox
            id="displayTracks"
            label="Display album track count"
            defaultChecked={displayTracks}
            onChange={(event) =>
              defer(dispatch, setSettings({ displayTracks: event.target.checked }))
            }
          />
        </div>
      </div>
    </div>
  )
}

export default DisplayTracksField
