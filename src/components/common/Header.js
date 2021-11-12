import classNames from 'classnames'

/**
 * Render header
 *
 * @param {{
 *   title?: string
 *   className?: string
 *   compact?: boolean
 *   children?: React.ReactNode
 * }} props
 */
function Header({ title = 'Spotify Release List', className, compact, children }) {
  return (
    <nav className={classNames('Header', className)}>
      <div
        className={classNames('Header__title title is-4 has-text-light', {
          'is-hidden-touch': compact,
        })}
      >
        {title}
      </div>
      {children}
    </nav>
  )
}

export default Header
