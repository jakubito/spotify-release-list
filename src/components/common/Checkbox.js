import classNames from 'classnames'

/**
 * Render checkbox input
 *
 * @param {{
 *   id?: string
 *   name?: string
 *   className?: string
 *   label?: string
 *   labelClassName?: string
 *   value?: string
 *   checked?: boolean
 *   defaultChecked?: boolean
 *   onChange?: React.ChangeEventHandler<HTMLInputElement>
 *   readOnly?: boolean
 *   dark?: boolean
 * }} props
 */
function Checkbox({
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
  dark,
}) {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        readOnly={readOnly}
        className={classNames(className, 'is-checkradio', 'is-circle', 'has-background-color', {
          'is-white': !dark,
          'is-dark': dark,
          'no-label': !label,
        })}
      />
      <label htmlFor={id} className={classNames(labelClassName)}>
        {label}
      </label>
    </>
  )
}

export default Checkbox
