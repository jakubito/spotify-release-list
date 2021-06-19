import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { getMessage } from 'state/selectors'
import { hideMessage } from 'state/actions'

/**
 * Render message if exists
 */
function Message() {
  const message = useSelector(getMessage)
  const dispatch = useDispatch()

  if (!message) {
    return null
  }

  return (
    <div
      className={classNames('notification has-text-centered', {
        'is-dark': message.type === 'normal',
        'is-danger': message.type === 'error',
      })}
    >
      <button title="Close" className="delete" onClick={() => dispatch(hideMessage())} />
      {message.text}
    </div>
  )
}

export default Message
