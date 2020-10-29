import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getErrorMessage } from 'selectors'
import { hideErrorMessage } from 'actions'

/**
 * Render error message if exists
 */
function Error() {
  const errorMessage = useSelector(getErrorMessage)
  const dispatch = useDispatch()

  if (!errorMessage) {
    return null
  }

  return (
    <div className="Error notification is-danger has-text-centered">
      <button title="Close" className="delete" onClick={() => dispatch(hideErrorMessage())} />
      {errorMessage}
    </div>
  )
}

export default Error
