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
      <AutoSyncField />
      <AutoSyncTimeField />
    </div>
  )
}

export default AutomationSettings
