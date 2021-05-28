import classNames from 'classnames'

/**
 * Render children horizontally
 *
 * @param {{ className?: string, children: React.ReactNode }} props
 */
function HorizontalLayout({ className, children }) {
  return <div className={classNames('HorizontalLayout', className)}>{children}</div>
}

export default HorizontalLayout
