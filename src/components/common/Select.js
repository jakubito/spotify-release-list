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
 *   options: SelectOptions
 * }} props
 */
function Select({ id, name, value, defaultValue, onChange, icon, options }) {
  return (
    <div className={classNames('control', { 'has-icons-left': icon })}>
      <div className="select is-rounded">
        <select id={id} name={name} value={value} defaultValue={defaultValue} onChange={onChange}>
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
