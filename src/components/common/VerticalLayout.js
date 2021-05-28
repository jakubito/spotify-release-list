import classNames from 'classnames'

/**
 * Render children vertically
 *
 * @param {{ className?: string, children: React.ReactNode }} props
 */
function VerticalLayout({ className, children }) {
  return <div className={classNames('VerticalLayout', className)}>{children}</div>
}

export default VerticalLayout
