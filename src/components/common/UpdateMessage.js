import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { defer } from 'helpers'
import { getUpdateReady } from 'state/selectors'
import { dismissUpdate, triggerUpdate } from 'state/actions'

/**
 * Render update message
 */
function UpdateMessage() {
  const updateReady = useSelector(getUpdateReady)
  const dispatch = useDispatch()
  const [triggered, setTriggered] = useState(false)

  const trigger = () => {
    setTriggered(true)
    defer(dispatch, triggerUpdate())
  }

  if (!updateReady) {
    return null
  }

  return (
    <div className="UpdateMessage notification has-text-centered is-info">
      {!triggered && (
        <button title="Close" className="delete" onClick={() => dispatch(dismissUpdate())} />
      )}
      <div className="UpdateMessage__content">
        <button
          className={classNames('UpdateMessage__button button is-ghost', {
            'is-loading': triggered,
          })}
          onClick={trigger}
        >
          An update has been found. Click here to load the latest version.
        </button>
      </div>
    </div>
  )
}

export default UpdateMessage
