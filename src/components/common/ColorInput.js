import { useRef, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import classNames from 'classnames'
import { useClickOutside } from 'hooks'

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
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const containerRef = useRef()
  const [pickerVisible, setPickerVisible] = useState(false)
  const openPicker = () => setPickerVisible(true)
  const closePicker = () => setPickerVisible(false)

  useClickOutside(containerRef, closePicker)

  return (
    <div
      className={classNames(className, 'ColorInput dropdown', { 'is-active': pickerVisible })}
      ref={containerRef}
    >
      <div className="dropdown-trigger">
        <div className="control has-icons-left">
          <HexColorInput
            id={id}
            name={name}
            className="ColorInput__input input is-rounded has-text-weight-medium is-dark"
            color={color}
            onChange={onChange}
            onFocus={openPicker}
            onBlur={closePicker}
          />
          <span className="ColorInput__icon icon is-small is-left">
            <i className="fas fa-hashtag" />
          </span>
        </div>
      </div>
      <div className="dropdown-menu">
        <div className="ColorInput__content dropdown-content">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      </div>
    </div>
  )
}

export default ColorInput
