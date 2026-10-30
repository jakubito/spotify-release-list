import { useDispatch, useSelector } from 'react-redux'
import { hidePlaylistModal, hideUpdatePlaylistModal } from 'state/actions'
import { getPlaylistModalVisible, getUpdatePlaylistModalVisible } from 'state/selectors'
import { deferred } from 'helpers'
import PlaylistModal from './PlaylistModal'
import UpdatePlaylistModal from './UpdatePlaylistModal'

/**
 * Playlist modals container
 */
function PlaylistModalContainer() {
  const dispatch = useDispatch()
  const createVisible = useSelector(getPlaylistModalVisible)
  const updateVisible = useSelector(getUpdatePlaylistModalVisible)

  if (createVisible) {
    return <PlaylistModal closeModal={deferred(dispatch, hidePlaylistModal())} />
  }

  if (updateVisible) {
    return <UpdatePlaylistModal closeModal={deferred(dispatch, hideUpdatePlaylistModal())} />
  }

  return null
}

export default PlaylistModalContainer
