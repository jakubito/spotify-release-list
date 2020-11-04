import React from 'react'
import { useDispatch } from 'react-redux'
import { reset, hideResetModal, showSettingsModal } from 'state/actions'
import { useModal } from 'hooks'
import Button from 'components/Button'

/**
 * Render reset data modal
 */
function ResetModal() {
  const dispatch = useDispatch()
  const closeModal = useModal(hideResetModal)

  return (
    <div className="ResetModal modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-content has-background-black-bis has-text-light">
        <h4 className="title is-4 has-text-light has-text-centered">
          Are you sure you want to delete all data?
        </h4>

        <div className="actions has-text-centered">
          <Button
            title="Go back"
            icon="fas fa-arrow-left"
            onClick={() => dispatch(showSettingsModal())}
          >
            No, go back
          </Button>
          <Button
            title="Delete all data"
            icon="far fa-trash-alt"
            onClick={() => dispatch(reset())}
            danger
          >
            Yes, delete all data
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResetModal
