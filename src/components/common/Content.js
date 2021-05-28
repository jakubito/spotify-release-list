import classNames from 'classnames'

/**
 * Render content
 *
 * @param {{ className?: string, children: React.ReactNode }} props
 */
function Content({ className, children }) {
  return <div className={classNames('Content', className)}>{children}</div>
}

export default Content
