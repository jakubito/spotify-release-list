import CoversField from './CoversField'
import ThemeField from './ThemeField'

/**
 * Render appearance settings fields
 *
 * @param {RouteComponentProps} props
 */
function AppearanceSettings(props) {
  return (
    <>
      <ThemeField />
      <CoversField />
    </>
  )
}

export default AppearanceSettings
