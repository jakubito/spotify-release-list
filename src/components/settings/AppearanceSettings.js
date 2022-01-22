import CoversField from './CoversField'
import DisplayTracksField from './DisplayTracksField'
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
      <DisplayTracksField />
    </div>
  )
}

export default AppearanceSettings
