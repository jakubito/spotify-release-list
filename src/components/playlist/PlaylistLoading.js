import { Button } from 'components/common'

/**
 * Render playlist creation progress bar
 *
 * @param {{ title: string, cancel: () => void }} props
 */
function PlaylistLoading({ title, cancel }) {
  return (
    <>
      <div className="PlaylistLoading">
        <progress className="progress is-small" />
        {title}
      </div>
      <div className="actions">
        <Button title="Cancel" key="cancel" onClick={cancel} />
      </div>
    </>
  )
}

export default PlaylistLoading
