import classNames from 'classnames'
import { isString } from 'helpers'
import { Anchor } from '.'

/**
 * Render button anchor
 *
 * @param {Omit<ButtonProps, 'type' | 'onClick' | 'disabled'> & { href: string }} props
 */
function ButtonAnchor({
  href,
  title,
  titleOnly,
  children,
  icon,
  className,
  small,
  medium,
  dark,
  darker,
  primary,
  danger,
  text,
}) {
  const noStyle = !dark && !darker && !primary && !danger && !text
  const content = children || title

  return (
    <Anchor
      href={href}
      title={title || titleOnly}
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
    </Anchor>
  )
}

export default ButtonAnchor
