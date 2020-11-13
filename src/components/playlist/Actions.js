import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import classNames from 'classnames'
import { getCreatingPlaylist, getWorking, getPlaylistId } from 'state/selectors'
import { resetPlaylist, createPlaylistCancel } from 'state/actions'
import Button from 'components/Button'

/**
 * Render playlist form actions
 *
 * @param {{ submitTriggered: boolean }} props
 */
function Actions({ submitTriggered }) {
  const dispatch = useDispatch()
  const creatingPlaylist = useSelector(getCreatingPlaylist)
  const working = useSelector(getWorking)
  const playlistId = useSelector(getPlaylistId)
  const { reset } = useFormContext()

  if (creatingPlaylist) {
    return (
      <Button
        title="Cancel"
        key="cancel"
        onClick={() => {
          reset({})
          dispatch(createPlaylistCancel())
        }}
      />
    )
  }

  if (playlistId) {
    return (
      <Button
        title="Start over"
        icon="fas fa-undo"
        key="reset"
        onClick={() => {
          reset({})
          dispatch(resetPlaylist())
        }}
      />
    )
  }

  return (
    <Button
      type="submit"
      title="Create"
      icon="fas fa-asterisk"
      className={classNames({ 'is-loading': submitTriggered })}
      disabled={working || submitTriggered}
      key="submit"
      primary
    />
  )
}

export default Actions
