import CoversField from './CoversField'
import GroupColorsField from './GroupColorsField'
import ThemeField from './ThemeField'

/**
 * Render appearance settings fields
 *
 * @param {RouteComponentProps} props
 */
function AppearanceSettings(props) {
  return (
    <div className="fade-in">
      <ThemeField />
      <CoversField />
      <GroupColorsField />
    </div>
  )
}

export default AppearanceSettings
