import { useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import debounce from 'lodash/debounce'
import { AlbumGroupLabels } from 'enums'
import { deferred } from 'helpers'
import { getSettingsGroupColors } from 'state/selectors'
import { setSettings } from 'state/actions'
import { Button, ColorInput } from 'components/common'
import GroupColorsShortcuts from './GroupColorsShortcuts'

/**
 * Render group color scheme field
 */
function GroupColorsField() {
  const groupColors = useSelector(getSettingsGroupColors)
  const dispatch = useDispatch()
  const refs = useRef(/** @type {Record<AlbumGroup, HTMLDivElement>} */ ({}))

  /** @type {(group: AlbumGroup, color: string) => void} */
  const saveColor = (group, color) => {
    dispatch(setSettings({ groupColors: { ...groupColors, [group]: color } }))
  }

  /** @type {(group: AlbumGroup, ref: HTMLDivElement) => void} */
  const saveRef = (group, ref) => {
    refs.current[group] = ref
  }

  const saveColorDebounced = useCallback(debounce(saveColor, 100), [groupColors])

  return (
    <div className="GroupColorsField Settings__field field">
      <label className="label has-text-light">Color scheme</label>
      {AlbumGroupLabels.map(([group, label]) => (
        <div className="GroupColorsField__row" ref={(ref) => saveRef(group, ref)} key={group}>
          <Button
            title={label}
            icon="fas fa-circle"
            className="GroupColorsField__label"
            style={{ color: groupColors[group] }}
            // Can't use input ref directly https://github.com/omgovich/react-colorful/issues/60
            onClick={deferred(() => refs.current[group]?.querySelector('input').focus())}
          />
          <ColorInput
            color={groupColors[group]}
            onChange={(color) => saveColorDebounced(group, color)}
            className="GroupColorsField__input"
          />
        </div>
      ))}
      <GroupColorsShortcuts />
    </div>
  )
}

export default GroupColorsField
