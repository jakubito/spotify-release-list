import { useSelector } from 'react-redux'
import { getPlaylistModalVisible } from 'state/selectors'
import PlaylistModal from './PlaylistModal'

/**
 * New playlist modal container
 */
function PlaylistModalContainer() {
  const visible = useSelector(getPlaylistModalVisible)

  if (!visible) {
    return null
  }

  return <PlaylistModal />
}

export default PlaylistModalContainer
