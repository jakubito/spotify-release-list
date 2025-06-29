import { useDispatch, useSelector } from 'react-redux'
import { hideLabelPlaylistModal } from 'state/actions'
import { getLabelPlaylistModalVisible } from 'state/selectors'
import { deferred } from 'helpers'
import LabelPlaylistModal from './LabelPlaylistModal'

/**
 * Label playlist modal container
 */
function LabelPlaylistModalContainer() {
  const dispatch = useDispatch()
  const visible = useSelector(getLabelPlaylistModalVisible)

  if (visible) {
    return <LabelPlaylistModal closeModal={deferred(dispatch, hideLabelPlaylistModal())} />
  }

  return null
}

export default LabelPlaylistModalContainer