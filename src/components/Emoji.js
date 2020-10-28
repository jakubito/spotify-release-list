import React from 'react'
import PropTypes from 'prop-types'

/**
 * Render accessible emoji
 *
 * @param {{ value: string, label: string }} props
 */
function Emoji({ value, label }) {
  return (
    <span role="img" aria-label={`${label} emoji`}>
      {value}
    </span>
  )
}

Emoji.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default Emoji
