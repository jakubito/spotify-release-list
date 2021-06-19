import AutoSyncField from './AutoSyncField'
import AutoSyncTimeField from './AutoSyncTimeField'
import NotificationsField from './NotificationsField'

/**
 * Render automation settings screen
 *
 * @param {RouteComponentProps} props
 */
function AutomationSettings(props) {
  return (
    <div className="fade-in">
      <article className="message is-dark">
        <div className="message-body">
          Please note that for the auto refresh and notifications to be working correctly, the app
          has to be running in the background. Therefore, these features don't work on mobile
          devices, only on desktops.
        </div>
      </article>
      <AutoSyncField />
      <AutoSyncTimeField />
      <NotificationsField />
    </div>
  )
}

export default AutomationSettings
