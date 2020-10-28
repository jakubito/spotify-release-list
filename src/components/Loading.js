import React from 'react'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { defer } from 'helpers'
import { syncCancel } from 'actions'

/**
 * Render loading screen
 */
function Loading() {
  const dispatch = useDispatch()
  const cancelSyncTrigger = () => defer(dispatch, syncCancel())

  useHotkeys('esc', cancelSyncTrigger)

  return (
    <div className="Loading center">
      <div className="has-text-centered has-text-light has-text-weight-semibold is-size-5">
        Loading, please wait...
      </div>
      <button
        title="Cancel sync [ESC]"
        className="cancel button is-rounded is-dark has-text-weight-semibold"
        onClick={cancelSyncTrigger}
      >
        <span>Cancel</span>
      </button>
    </div>
  )
}

export default Loading
