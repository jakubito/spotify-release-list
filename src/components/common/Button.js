import classNames from 'classnames'
import { isString } from 'helpers'

/**
 * Render button
 *
 * @param {ButtonProps} props
 */
function Button({
  type = 'button',
  title,
  titleOnly,
  onClick,
  children,
  icon,
  disabled,
  className,
  small,
  medium,
  dark,
  darker,
  primary,
  danger,
  text,
  style,
}) {
  const noStyle = !dark && !darker && !primary && !danger && !text
  const content = children || title

  return (
    <button
      type={type}
      title={title || titleOnly}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={classNames(className, 'button', 'is-rounded', 'has-text-weight-semibold', {
        'is-small': small,
        'is-medium': medium,
        'is-dark': dark || darker || noStyle,
        'is-darker': darker || noStyle,
        'is-primary': primary,
        'is-danger': danger,
        'is-text': text,
      })}
    >
      {icon && (
        <span className="icon" key={icon}>
          <i className={icon} />
        </span>
      )}
      {isString(content) ? <span>{content}</span> : content}
    </button>
  )
}

export default Button
