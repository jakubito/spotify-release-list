import classNames from 'classnames'

/**
 * Render checkbox input
 *
 * @param {{
 *   id?: string
 *   name?: string
 *   className?: string
 *   label?: string
 *   value?: string
 *   checked?: boolean
 *   defaultChecked?: boolean
 *   onChange?: React.ChangeEventHandler<HTMLInputElement>
 *   dark?: boolean
 * }} props
 */
function Checkbox({ id, name, className, label, value, checked, defaultChecked, onChange, dark }) {
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
        className={classNames(className, 'is-checkradio', 'is-circle', 'has-background-color', {
          'is-white': !dark,
          'is-dark': dark,
        })}
      />
      {label && (
        <label htmlFor={id} className="has-text-weight-semibold">
          {label}
        </label>
      )}
    </>
  )
}

export default Checkbox
