import AutoSyncField from './AutoSyncField'
import AutoSyncTimeField from './AutoSyncTimeField'

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
          Please note that for the auto refresh feature to be working correctly, the app has to be
          running in the background. Therefore, it does not work on mobile devices, only on desktop.
        </div>
      </article>
      <AutoSyncField />
      <AutoSyncTimeField />
    </div>
  )
}

export default AutomationSettings
