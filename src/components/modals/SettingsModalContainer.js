import React from 'react';
import { useSelector } from 'react-redux';
import { getSettingsModalVisible } from '../../selectors';
import SettingsModal from './SettingsModal';

function SettingsModalContainer() {
  const visible = useSelector(getSettingsModalVisible);

  if (!visible) {
    return null;
  }

  return <SettingsModal />;
}

export default SettingsModalContainer;
