import React from 'react'
import classNames from 'classnames'
import { isString } from 'helpers'

/**
 * Render button
 *
 * @param {{
 *   type?: 'submit' | 'reset' | 'button'
 *   title?: string
 *   titleOnly?: string
 *   onClick?: React.MouseEventHandler<HTMLButtonElement>
 *   children?: React.ReactNode
 *   icon?: string
 *   disabled?: boolean
 *   className?: string
 *   small?: boolean
 *   medium?: boolean
 *   dark?: boolean
 *   darker?: boolean
 *   primary?: boolean
 *   danger?: boolean
 *   text?: boolean
 * }} props
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
}) {
  const noStyle = !dark && !darker && !primary && !danger && !text
  const content = children || title

  return (
    <button
      type={type}
      title={title || titleOnly}
      onClick={onClick}
      disabled={disabled}
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
