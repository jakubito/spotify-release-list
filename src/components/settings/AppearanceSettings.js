import CoversField from './CoversField'
import MetaField from './MetaField'
import GroupColorsField from './GroupColorsField'
import ThemeField from './ThemeField'
import ReleasesOrderField from './ReleasesOrderField'

/**
 * Render appearance settings fields
 */
function AppearanceSettings() {
  return (
    <div className="fade-in">
      <GroupColorsField />
      <ThemeField />
      <ReleasesOrderField />
      <CoversField />
      <MetaField />
    </div>
  )
}

export default AppearanceSettings
