import classNames from 'classnames'

/**
 * Render header
 *
 * @param {{ title?: string, className?: string, children?: React.ReactNode }} props
 */
function Header({ title = 'Spotify Release List', className, children }) {
  return (
    <nav className={classNames('Header', className)}>
      <div className="title is-4 has-text-light">{title}</div>
      {children}
    </nav>
  )
}

export default Header
