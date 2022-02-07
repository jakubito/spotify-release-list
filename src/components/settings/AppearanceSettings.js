import CoversField from './CoversField'
import MetaField from './MetaField'
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
      <MetaField />
    </div>
  )
}

export default AppearanceSettings
