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
 *   step?: string
 *   min?: string
 *   max?: string
 *   pattern?: string
 *   disabled?: boolean
 *   onChange?: React.ChangeEventHandler<HTMLInputElement>
 *   onBlur?: React.FocusEventHandler<HTMLInputElement>
 * }} props
 * @param {React.Ref<HTMLInputElement>} ref
 */
function Input(props, ref) {
  const {
    type = 'text',
    id,
    name,
    className,
    value,
    defaultValue,
    placeholder,
    step,
    min,
    max,
    pattern,
    disabled,
    onChange,
  } = props

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      className={classNames(className, 'input', 'is-rounded', 'has-text-weight-medium', 'is-dark')}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      pattern={pattern}
      disabled={disabled}
      onChange={onChange}
      ref={ref}
    />
  )
}

export default forwardRef(Input)
