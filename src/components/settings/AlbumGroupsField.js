import xor from 'lodash/xor'
import orderBy from 'lodash/orderBy'
import { useSelector, useDispatch } from 'react-redux'
import { AlbumGroupIndex, AlbumGroupLabels } from 'enums'
import { getSettingsGroups } from 'state/selectors'
import { setSettings } from 'state/actions'
import { Checkbox } from 'components/common'
import HelpText from './HelpText'

/**
 * Render album groups selection field
 */
function AlbumGroupsField() {
  const groups = useSelector(getSettingsGroups)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const newValue = xor(groups, [/**@type {AlbumGroup} */ (event.target.value)])
    const newValueOrdered = orderBy(newValue, (group) => AlbumGroupIndex[group])

    if (newValueOrdered.length > 0) {
      dispatch(setSettings({ groups: newValueOrdered }))
    }
  }

  return (
    <div className="AlbumGroupsField Settings__field field">
      <label className="label has-text-light">
        Releases to fetch <HelpText>(less is faster)</HelpText>
      </label>
      <div className="control">
        {AlbumGroupLabels.map(([group, label]) => (
          <div className="field" key={group}>
            <Checkbox
              id={`albumGroups_${group}`}
              label={label}
              value={group}
              checked={groups.includes(group)}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlbumGroupsField
