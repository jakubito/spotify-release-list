import Media from 'react-media'
import classNames from 'classnames'

/**
 * Render header
 *
 * @param {{ title?: string, className?: string, children?: React.ReactNode }} props
 */
function Header({ title, className, children }) {
  return (
    <nav className={classNames('Header', className)}>
      <div className="title is-4 has-text-light">
        {title || (
          <>
            Spotify <Media query={{ maxWidth: 375 }}>{(matches) => matches && <br />}</Media>
            Release List
          </>
        )}
      </div>
      {children}
    </nav>
  )
}

export default Header
