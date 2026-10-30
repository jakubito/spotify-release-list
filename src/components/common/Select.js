import classNames from 'classnames'

/**
 * Render select
 *
 * @param {{
 *   id?: string
 *   name?: string
 *   value?: string
 *   defaultValue?: string
 *   onChange?: React.ChangeEventHandler<HTMLSelectElement>
 *   icon?: string
 *   disabled?: boolean
 *   fullWidth?: boolean
 *   options: SelectOptions
 * }} props
 */
function Select({ id, name, value, defaultValue, onChange, icon, disabled, fullWidth, options }) {
  return (
    <div className={classNames('control', { 'has-icons-left': icon, 'is-expanded': fullWidth })}>
      <div className={classNames('select is-rounded', { 'is-fullwidth': fullWidth })}>
        <select
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
        >
          {options.map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {icon && (
        <span className="icon is-left" key={icon}>
          <i className={icon} />
        </span>
      )}
    </div>
  )
}

export default Select
