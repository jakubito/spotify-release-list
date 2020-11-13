import React from 'react'
import { NameField, DescriptionField, VisibilityField } from '.'

/**
 * Render playlist form
 */
function PlaylistForm() {
  return (
    <div className="PlaylistForm">
      <NameField />
      <DescriptionField />
      <VisibilityField />
    </div>
  )
}

export default PlaylistForm
