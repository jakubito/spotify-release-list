import { useSelector } from 'react-redux'
import { getWorking, getLabelSelectedReleases } from 'state/selectors'
import { Button } from 'components/common'
import NameField from './NameField'
import DescriptionField from './DescriptionField'
import VisibilityField from './VisibilityField'

/**
 * Form for creating playlists from label releases
 */
function LabelPlaylistForm({ submitTriggered, closeModal }) {
  const working = useSelector(getWorking)
  const selectedReleases = useSelector(getLabelSelectedReleases)

  // Generate default playlist name based on selected releases
  const defaultName = () => {
    if (selectedReleases.length === 0) return 'Label Releases'
    
    // Try to extract label name from first release
    const firstRelease = selectedReleases[0]
    const releaseYear = new Date(firstRelease.release_date).getFullYear()
    
    return `Label Releases ${releaseYear}`
  }

  return (
    <>
      <div className="LabelPlaylistForm">
        <NameField defaultValue={defaultName()} />
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

export default LabelPlaylistForm