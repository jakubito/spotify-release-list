import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { defer } from 'helpers'
import { getSettings } from 'state/selectors'
import { setSettings } from 'state/actions'
import { Button, Checkbox } from 'components/common'

/**
 * Render notifications field
 */
function NotificationsField() {
  const { notifications } = useSelector(getSettings)
  const dispatch = useDispatch()
  const [permission, setPermission] = useState(window.Notification?.permission)

  const renderContent = () => {
    if (!window.Notification) {
      return (
        <div className="has-text-grey-light">
          <span className="icon">
            <i className="fas fa-frown"></i>
          </span>{' '}
          Not supported on this device
        </div>
      )
    }

    if (permission === 'denied') {
      return (
        <div className="has-text-grey-light">
          <span className="icon">
            <i className="fas fa-bell-slash"></i>
          </span>{' '}
          Blocked by the browser
        </div>
      )
    }

    if (permission === 'default') {
      return (
        <Button
          title="Enable notifications"
          icon="fas fa-bell"
          onClick={() => Notification.requestPermission().then(setPermission)}
        />
      )
    }

    return (
      <Checkbox
        id="notifications"
        label="Notify me about new releases"
        defaultChecked={notifications}
        onChange={(event) => defer(dispatch, setSettings({ notifications: event.target.checked }))}
      />
    )
  }

  return (
    <div className="NotificationsField Settings__field field">
      <label className="label has-text-light" htmlFor="notifications">
        Browser notifications
      </label>
      <div className="control">
        <div className="field">{renderContent()}</div>
      </div>
    </div>
  )
}

export default NotificationsField
