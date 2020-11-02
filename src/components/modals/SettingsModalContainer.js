import React from 'react'
import { useSelector } from 'react-redux'
import { getSettingsModalVisible } from 'state/selectors'
import SettingsModal from './SettingsModal'

/**
 * Settings modal container
 */
function SettingsModalContainer() {
  const visible = useSelector(getSettingsModalVisible)

  if (!visible) {
    return null
  }

  return <SettingsModal />
}

export default SettingsModalContainer
