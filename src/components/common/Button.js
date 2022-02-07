import { useMediaQuery } from 'react-responsive'
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
  compact,
  newBadge,
}) {
  const isTablet = useMediaQuery({ minWidth: 769 })
  const noStyle = !dark && !darker && !primary && !danger && !text
  const content = children || title
  const contentWrapped = isString(content) ? <span>{content}</span> : content
  const displayContent = !compact || isTablet

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
        'button--compact': compact,
        'has-badge': newBadge,
      })}
    >
      {icon && (
        <span className="icon" key={icon}>
          <i className={icon} />
        </span>
      )}
      {displayContent && contentWrapped}
      {newBadge && <div className="badge badge--primary">NEW</div>}
    </button>
  )
}

export default Button
