import { useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { createPlaylistCancel } from 'state/actions'
import { Button } from 'components/common'

/**
 * Render playlist creation progress bar
 */
function PlaylistLoading() {
  const dispatch = useDispatch()
  const { reset } = useFormContext()

  const cancel = () => {
    reset({})
    dispatch(createPlaylistCancel())
  }

  return (
    <>
      <div className="PlaylistLoading">
        <progress className="progress is-small" />
        Creating playlist, please wait...
      </div>
      <div className="actions">
        <Button title="Cancel" key="cancel" onClick={cancel} />
      </div>
    </>
  )
}

export default PlaylistLoading
