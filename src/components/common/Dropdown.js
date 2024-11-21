import classNames from 'classnames'
import { useClickOutside, useFocusOutside } from 'hooks'
import { useRef } from 'react'

/**
 * Render dropdown
 *
 * @param {{
 *   active?: boolean
 *   right?: boolean
 *   className?: string
 *   contentClassName?: string
 *   dark?: boolean
 *   trigger: React.ReactNode
 *   children: React.ReactNode
 *   close: Fn
 * }} props
 */
function Dropdown({ active, right, className, contentClassName, dark, trigger, children, close }) {
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const ref = useRef()

  return (
    <div
      className={classNames(className, 'Dropdown dropdown', {
        'is-active': active,
        'is-right': right,
        'Dropdown--dark': dark,
      })}
      ref={ref}
    >
      <div className="dropdown-trigger">{trigger}</div>
      {active && (
        <DropdownMenu className={contentClassName} containerRef={ref} close={close}>
          {children}
        </DropdownMenu>
      )}
    </div>
  )
}

/**
 * @param {{
 *   className?: string
 *   containerRef: React.MutableRefObject<HTMLDivElement>
 *   children: React.ReactNode
 *   close: Fn
 * }} props
 */
function DropdownMenu({ className, containerRef, children, close }) {
  useClickOutside(containerRef, close)
  useFocusOutside(containerRef, close)

  return (
    <div className="dropdown-menu" role="menu">
      <div className={classNames(className, 'dropdown-content')}>{children}</div>
    </div>
  )
}

export default Dropdown
