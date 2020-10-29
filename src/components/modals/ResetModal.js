import React from 'react'
import { useDispatch } from 'react-redux'
import { reset, hideResetModal, showSettingsModal } from 'actions'
import { useModal } from 'hooks'

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
          <button
            className="button is-dark is-rounded has-text-weight-semibold"
            onClick={() => dispatch(showSettingsModal())}
          >
            <span className="icon">
              <i className="fas fa-arrow-left" />
            </span>
            <span>No, go back</span>
          </button>
          <button
            className="button is-danger is-rounded has-text-weight-semibold"
            onClick={() => dispatch(reset())}
          >
            <span className="icon">
              <i className="far fa-trash-alt" />
            </span>
            <span>Yes, delete all data</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetModal
