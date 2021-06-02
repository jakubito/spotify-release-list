import { useModal } from 'hooks'
import { Button } from 'components/common'

/**
 * Render reset data modal
 *
 * @param {{ closeModal: () => void, resetData: () => void }} props
 */
function ResetModal({ closeModal, resetData }) {
  useModal(closeModal)

  return (
    <div className="ResetModal modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-content has-background-black-bis has-text-light fade-in">
        <h4 className="title is-4 has-text-light has-text-centered">Are you sure?</h4>
        <div className="has-text-centered">
          <Button
            title="Go back"
            icon="fas fa-arrow-left"
            className="ResetModal__button"
            onClick={closeModal}
          />
          <Button
            title="Delete app data"
            icon="fas fa-trash-alt"
            className="ResetModal__button"
            onClick={resetData}
            danger
          />
        </div>
      </div>
    </div>
  )
}

export default ResetModal
