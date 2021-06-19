import classNames from 'classnames'
import { colord } from 'colord'

/**
 * Render classic anchor link
 *
 * @param {{
 *   title: string
 *   href: string
 *   className?: string
 *   color?: string
 *   children?: React.ReactNode
 * }} props
 */
function Anchor({ title, href, className, color, children }) {
  const style = color && {
    color,
    textDecorationColor: colord(color).darken(0.15).desaturate(0.25).toHex(),
  }

  return (
    <a
      title={title}
      href={href}
      className={classNames('Anchor', className)}
      target={href.startsWith('spotify:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={style}
    >
      {children || title}
    </a>
  )
}

export default Anchor
