import React from 'react'

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

export default Emoji
