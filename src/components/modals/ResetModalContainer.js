import React from 'react'
import { useSelector } from 'react-redux'
import { getResetModalVisible } from 'selectors'
import ResetModal from './ResetModal'

/**
 * Reset data modal container
 */
function ResetModalContainer() {
  const visible = useSelector(getResetModalVisible)

  if (!visible) {
    return null
  }

  return <ResetModal />
}

export default ResetModalContainer
