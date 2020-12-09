import { useSelector } from 'react-redux'
import { getSettingsUriLinks } from 'state/selectors'

/**
 * Render URI/URL link
 *
 * @param {{
 *   title: string
 *   uri: string
 *   url: string
 *   className?: string
 *   children: React.ReactNode
 * }} props
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

export default Link
