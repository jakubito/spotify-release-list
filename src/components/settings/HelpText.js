import React from 'react'

/**
 * Render field help text
 *
 * @param {{ children: React.ReactNode }} props
 */
function HelpText({ children }) {
  return <span className="has-text-weight-light has-text-grey">{children}</span>
}

export default HelpText
