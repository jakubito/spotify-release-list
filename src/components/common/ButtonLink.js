import { useMatch, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { deferred } from 'helpers'
import { Button } from '.'

/**
 * Render button router link
 *
 * @param {ButtonProps & { to: string, match?: string, activeClass?: string }} props
 */
function ButtonLink({ to, match, activeClass, className, ...buttonProps }) {
  const active = useMatch(match || to)
  const navigate = useNavigate()

  return (
    <Button
      {...buttonProps}
      className={classNames(className, { ...(activeClass && { [activeClass]: active }) })}
      onClick={deferred(navigate, to)}
    />
  )
}

export default ButtonLink
