import { useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import classNames from 'classnames'
import { Dropdown } from 'components/common'

/**
 * Render color picker input
 *
 * @param {{
 *   id?: string
 *   name?: string
 *   className?: string
 *   color?: string
 *   onChange?: (newColor: string) => void
 * }} props
 */
function ColorInput({ id, name, className, color, onChange }) {
  const [pickerVisible, setPickerVisible] = useState(false)

  const trigger = (
    <div className="control has-icons-left">
      <HexColorInput
        id={id}
        name={name}
        className="ColorInput__input input is-rounded has-text-weight-medium is-dark"
        color={color}
        onChange={onChange}
        onFocus={() => setPickerVisible(true)}
      />
      <span className="ColorInput__icon icon is-small is-left">
        <i className="fas fa-hashtag" />
      </span>
    </div>
  )

  return (
    <Dropdown
      className={classNames(className, 'ColorInput dropdown')}
      contentClassName="ColorInput__content"
      active={pickerVisible}
      trigger={trigger}
      close={() => setPickerVisible(false)}
    >
      <HexColorPicker color={color} onChange={onChange} />
    </Dropdown>
  )
}

export default ColorInput
