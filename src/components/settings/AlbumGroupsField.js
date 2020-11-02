import React from 'react'
import xor from 'lodash/xor'
import orderBy from 'lodash/orderBy'
import { useSelector, useDispatch } from 'react-redux'
import { AlbumGroup } from 'enums'
import { getSettingsGroups } from 'state/selectors'
import { setSettings } from 'state/actions'
import { defer } from 'helpers'
import HelpText from './HelpText'

/** @type {[group: AlbumGroup, label: string][]} */
const fields = [
  [AlbumGroup.ALBUM, 'Albums'],
  [AlbumGroup.SINGLE, 'Singles'],
  [AlbumGroup.COMPILATION, 'Compilations'],
  [AlbumGroup.APPEARS_ON, 'Appearances'],
]

/**
 * Render album groups selection field
 */
function AlbumGroupsField() {
  const groups = useSelector(getSettingsGroups)
  const dispatch = useDispatch()

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const onChange = (event) => {
    const groupValues = Object.values(AlbumGroup)
    const newValue = xor(groups, [event.target.value])
    const newValueOrdered = orderBy(newValue, (group) => groupValues.indexOf(group))

    defer(dispatch, setSettings({ groups: newValueOrdered }))
  }

  return (
    <div className="field">
      <label className="label has-text-light">
        Request <HelpText>/ less is faster</HelpText>
      </label>
      <div className="control">
        {fields.map(([group, label]) => (
          <div className="field" key={group}>
            <input
              type="checkbox"
              className="is-checkradio has-background-color is-white"
              id={`albumGroups[${group}]`}
              name={`albumGroups[${group}]`}
              value={group}
              defaultChecked={groups.includes(group)}
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
