import { ButtonLink, Header } from 'components/common'

/**
 * Render settings header
 */
function SettingsHeader() {
  return (
    <Header title="Settings" className="SettingsHeader">
      <ButtonLink
        title="All good"
        to="/"
        icon="fas fa-check"
        className="is-hidden-tablet"
        primary
      />
    </Header>
  )
}

export default SettingsHeader
