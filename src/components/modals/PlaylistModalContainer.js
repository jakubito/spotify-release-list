import React from 'react';
import { useSelector } from 'react-redux';
import { getPlaylistModalVisible } from 'selectors';
import PlaylistModal from './PlaylistModal';

function PlaylistModalContainer() {
  const visible = useSelector(getPlaylistModalVisible);

  if (!visible) {
    return null;
  }

  return <PlaylistModal />;
}

export default PlaylistModalContainer;
