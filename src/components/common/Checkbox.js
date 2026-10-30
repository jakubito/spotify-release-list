import classNames from 'classnames'

/**
 * Render checkbox input
 *
 * @param {{
 *   id?: string
 *   name?: string
 *   className?: string
 *   label?: string | React.ReactNode
 *   labelClassName?: string
 *   value?: string
 *   checked?: boolean
 *   defaultChecked?: boolean
 *   onChange?: React.ChangeEventHandler<HTMLInputElement>
 *   readOnly?: boolean
 *   disabled?: boolean
 *   dark?: boolean
 *   style?: React.CSSProperties
 *   labelStyle?: React.CSSProperties
 *   ref?: React.Ref<HTMLInputElement>
 * }} props
 */
function Checkbox({
  ref,
  id,
  name,
  className,
  label,
  labelClassName,
  value,
  checked,
  defaultChecked,
  onChange,
  readOnly,
  disabled,
  dark,
  style,
  labelStyle,
}) {
  return (
    <>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={classNames(className, 'is-checkradio', 'is-circle', 'has-background-color', {
          'is-white': !dark,
          'is-dark': dark,
          'no-label': !label,
        })}
        style={style}
      />
      <label htmlFor={id} className={classNames(labelClassName)} style={labelStyle}>
        {label}
      </label>
    </>
  )
}

export default Checkbox
