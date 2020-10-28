import React from 'react'
import PropTypes from 'prop-types'

/**
 * Render vertically and horizontally centered content
 *
 * @param {{ children: ReactNode }} props
 */
function Centered({ children }) {
  return (
    <div className="center has-text-light has-text-weight-semibold">
      <div className="is-size-5 has-text-centered">{children}</div>
    </div>
  )
}

Centered.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Centered
