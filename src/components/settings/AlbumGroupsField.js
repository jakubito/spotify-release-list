import xor from 'lodash/xor'
import orderBy from 'lodash/orderBy'
import { useSelector, useDispatch } from 'react-redux'
import { AlbumGroupIndex, AlbumGroupLabels } from 'enums'
import { getSettingsGroups } from 'state/selectors'
import { setSettings } from 'state/actions'
import HelpText from './HelpText'

/**
 * Render album groups selection field
 */
function AlbumGroupsField() {
  const groups = useSelector(getSettingsGroups)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const newValue = xor(groups, [event.target.value])
    const newValueOrdered = orderBy(newValue, (group) => AlbumGroupIndex[group])

    dispatch(setSettings({ groups: newValueOrdered }))
  }

  return (
    <div className="field">
      <label className="label has-text-light">
        Request <HelpText>/ less is faster</HelpText>
      </label>
      <div className="control">
        {AlbumGroupLabels.map(([group, label]) => (
          <div className="field" key={group}>
            <input
              type="checkbox"
              className="is-checkradio has-background-color is-white"
              id={`albumGroups[${group}]`}
              name={`albumGroups[${group}]`}
              value={group}
              checked={groups.includes(group)}
              onChange={onChange}
            />
            <label htmlFor={`albumGroups[${group}]`} className="has-text-weight-semibold">
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlbumGroupsField
