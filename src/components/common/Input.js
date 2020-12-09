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
 *   onChange?: React.ChangeEventHandler<HTMLInputElement>
 * }} props
 * @param {React.Ref<HTMLInputElement>} ref
 */
function Input(
  { type = 'text', id, name, className, value, defaultValue, placeholder, onChange },
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
      onChange={onChange}
      ref={ref}
    />
  )
}

export default forwardRef(Input)
