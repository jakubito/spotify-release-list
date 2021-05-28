import classNames from 'classnames'

/**
 * Render classic anchor link
 *
 * @param {{
 *   title: string
 *   href: string
 *   className?: string
 *   children?: React.ReactNode
 * }} props
 */
function Anchor({ title, href, className, children }) {
  return (
    <a
      title={title}
      href={href}
      className={classNames('Anchor', className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children || title}
    </a>
  )
}

export default Anchor
