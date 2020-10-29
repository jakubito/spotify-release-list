import React from 'react'
import PropTypes from 'prop-types'

/**
 * Render field help text
 *
 * @param {{ children: React.ReactNode }} props
 */
function HelpText({ children }) {
  return <span className="has-text-weight-light has-text-grey">{children}</span>
}

HelpText.propTypes = {
  children: PropTypes.node.isRequired,
}

export default HelpText
