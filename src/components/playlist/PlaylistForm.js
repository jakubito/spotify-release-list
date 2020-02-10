import React from 'react';
import { DateRangeField, NameField, DescriptionField, VisibilityField } from '.';

function PlaylistForm() {
  return (
    <div className="PlaylistForm">
      <DateRangeField />
      <NameField />
      <DescriptionField />
      <VisibilityField />
    </div>
  );
}

export default PlaylistForm;
