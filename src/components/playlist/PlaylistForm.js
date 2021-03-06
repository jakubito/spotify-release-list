import { useSelector } from 'react-redux'
import { getWorking } from 'state/selectors'
import { Button } from 'components/common'
import NameField from './NameField'
import DescriptionField from './DescriptionField'
import VisibilityField from './VisibilityField'

/**
 * Render playlist form
 *
 * @param {{ submitTriggered: boolean, closeModal: () => void }} props
 */
function PlaylistForm({ submitTriggered, closeModal }) {
  const working = useSelector(getWorking)

  return (
    <>
      <div className="PlaylistForm">
        <NameField />
        <DescriptionField />
        <VisibilityField />
      </div>

      <div className="actions columns is-gapless">
        <div className="column">
          <Button
            type="submit"
            title="Create"
            icon="fas fa-asterisk"
            disabled={working || submitTriggered}
            key="submit"
            primary
          />
        </div>

        <div className="column has-text-right">
          <Button
            title="Close"
            icon="fas fa-times"
            onClick={closeModal}
            disabled={submitTriggered}
          />
        </div>
      </div>
    </>
  )
}

export default PlaylistForm
