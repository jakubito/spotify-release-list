import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import classNames from 'classnames'
import { getCreatingPlaylist, getWorking, getPlaylistId } from 'selectors'
import { resetPlaylist, createPlaylistCancel } from 'actions'

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
      <button
        type="button"
        className="button is-rounded is-dark has-text-weight-semibold"
        onClick={() => {
          reset({})
          dispatch(createPlaylistCancel())
        }}
        key="cancel"
      >
        <span className="icon">
          <i className="fas fa-times" />
        </span>
        <span>Cancel</span>
      </button>
    )
  }

  if (playlistId) {
    return (
      <button
        type="button"
        className="button is-rounded is-dark has-text-weight-semibold"
        onClick={() => {
          reset({})
          dispatch(resetPlaylist())
        }}
        key="reset"
      >
        <span className="icon">
          <i className="fas fa-undo" />
        </span>
        <span>Start over</span>
      </button>
    )
  }

  return (
    <button
      type="submit"
      className={classNames('button is-primary is-rounded has-text-weight-semibold', {
        'is-loading': submitTriggered,
      })}
      disabled={working || submitTriggered}
      key="submit"
    >
      <span className="icon">
        <i className="fas fa-asterisk" />
      </span>
      <span>Create</span>
    </button>
  )
}

Actions.propTypes = {
  submitTriggered: PropTypes.bool.isRequired,
}

export default Actions
