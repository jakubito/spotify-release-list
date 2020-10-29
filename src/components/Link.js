import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getSettingsUriLinks } from 'selectors'

/**
 * Render link that reacts to URI / URL setting changes
 *
 * @param {{
 *   title: string
 *   uri: string
 *   url: string
 *   className?: string
 *   children: React.ReactNode
 * } & AnyProps} props
 */
function Link({ title, uri, url, className, children }) {
  const uriLinks = useSelector(getSettingsUriLinks)

  return (
    <a
      title={title}
      href={uriLinks ? uri : url}
      className={className}
      {...(!uriLinks && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {children}
    </a>
  )
}

Link.propTypes = {
  title: PropTypes.string.isRequired,
  uri: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Link
