import { forwardRef } from 'react'
import classNames from 'classnames'

/**
 * Render input
 *
 * @param {{
 *   type?: string
 *   id?: string
 *   name?: string
 *   className?: string
 *   value?: string
 *   defaultValue?: string
 *   placeholder?: string
 *   disabled?: boolean
 *   onChange?: React.ChangeEventHandler<HTMLInputElement>
 *   onBlur?: React.FocusEventHandler<HTMLInputElement>
 * }} props
 * @param {React.Ref<HTMLInputElement>} ref
 */
function Input(
  { type = 'text', id, name, className, value, defaultValue, placeholder, disabled, onChange },
  ref
) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      className={classNames(className, 'input', 'is-rounded', 'has-text-weight-medium', 'is-dark')}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      ref={ref}
    />
  )
}

export default forwardRef(Input)
