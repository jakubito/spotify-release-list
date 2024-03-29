import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reset } from 'state/actions'
import { deferred } from 'helpers'
import { Button } from 'components/common'
import { ResetModal } from 'components/modals'

/**
 * Render user info and data reset button
 */
function DataReset() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modalVisible, setModalVisible] = useState(false)

  const resetData = deferred(() => {
    dispatch(reset())
    navigate('/')
  })

  return (
    <div className="DataReset">
      <Button
        title="Delete app data"
        icon="fas fa-trash-alt"
        className="DataReset__button"
        onClick={deferred(setModalVisible, true)}
        small
      />
      {modalVisible && (
        <ResetModal closeModal={deferred(setModalVisible, false)} resetData={resetData} />
      )}
    </div>
  )
}

export default DataReset
