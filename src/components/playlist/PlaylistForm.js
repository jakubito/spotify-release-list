import React from 'react'
import { DateRangeField, SelectionField, NameField, DescriptionField, VisibilityField } from '.'

/**
 * Render playlist form
 */
function PlaylistForm() {
  return (
    <div className="PlaylistForm">
      <DateRangeField />
      <SelectionField />
      <NameField />
      <DescriptionField />
      <VisibilityField />
    </div>
  )
}

export default PlaylistForm
