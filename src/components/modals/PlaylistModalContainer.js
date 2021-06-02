import { useDispatch, useSelector } from 'react-redux'
import { hidePlaylistModal } from 'state/actions'
import { getPlaylistModalVisible } from 'state/selectors'
import { deferred } from 'helpers'
import PlaylistModal from './PlaylistModal'

/**
 * New playlist modal container
 */
function PlaylistModalContainer() {
  const dispatch = useDispatch()
  const visible = useSelector(getPlaylistModalVisible)

  if (visible) {
    return <PlaylistModal closeModal={deferred(dispatch, hidePlaylistModal())} />
  }

  return null
}

export default PlaylistModalContainer
