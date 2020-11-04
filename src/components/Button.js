import React from 'react'
import classNames from 'classnames'
import { isString } from 'helpers'

/**
 * Render button
 *
 * @param {{
 *   type?: 'submit' | 'reset' | 'button'
 *   title: string
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
 * }} props
 */
function Button({
  type = 'button',
  title,
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
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'button',
        'is-rounded',
        'has-text-weight-semibold',
        {
          'is-small': small,
          'is-medium': medium,
          'is-dark': dark || darker || (!dark && !darker && !primary && !danger),
          'is-darker': darker,
          'is-primary': primary,
          'is-danger': danger,
        },
        className
      )}
    >
      {icon && (
        <span className="icon">
          <i className={icon} />
        </span>
      )}
      {isString(children) ? <span>{children}</span> : children}
    </button>
  )
}

export default Button
