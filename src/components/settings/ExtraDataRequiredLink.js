import { Link } from 'react-router-dom'

/**
 * Render link to the fetch extra album data setting
 *
 * @param {{ children: React.ReactNode }} props
 */
function ExtraDataRequiredLink({ children }) {
  return (
    <Link to="/settings#fetchExtraData" className="ExtraDataRequiredLink has-text-warning">
      {children}
    </Link>
  )
}

export default ExtraDataRequiredLink
