import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import { deferred } from 'helpers'
import { syncCancel } from 'state/actions'
import { Button } from 'components/common'

/**
 * Render loading screen
 */
function Loading() {
  const dispatch = useDispatch()
  const cancelSyncTrigger = deferred(dispatch, syncCancel())

  useHotkeys('esc', cancelSyncTrigger)

  return (
    <div className="Loading center">
      <div className="has-text-centered has-text-light has-text-weight-semibold is-size-5">
        Loading, please wait...
      </div>
      <Button title="Cancel sync [ESC]" className="cancel" onClick={cancelSyncTrigger}>
        Cancel
      </Button>
    </div>
  )
}

export default Loading
