import CoversField from './CoversField'
import GroupColorsField from './GroupColorsField'
import ThemeField from './ThemeField'

/**
 * Render appearance settings fields
 */
function AppearanceSettings() {
  return (
    <div className="fade-in">
      <GroupColorsField />
      <ThemeField />
      <CoversField />
    </div>
  )
}

export default AppearanceSettings
