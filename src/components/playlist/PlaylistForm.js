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

      <div className="actions">
        <Button
          type="submit"
          title="Create"
          disabled={working || submitTriggered}
          key="submit"
          primary
        />
        <Button title="Close" onClick={closeModal} disabled={submitTriggered} />
      </div>
    </>
  )
}

export default PlaylistForm
