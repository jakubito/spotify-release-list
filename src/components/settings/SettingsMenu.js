import { ButtonLink } from 'components/common'

/** @type {{ title: string, to: string, icon: string }[]} */
const links = [
  { title: 'General', to: '/settings', icon: 'fas fa-cog' },
  { title: 'Appearance', to: '/settings/appearance', icon: 'fas fa-tint' },
  { title: 'Automation', to: '/settings/automation', icon: 'fas fa-bolt' },
  { title: 'About', to: '/settings/about', icon: 'fas fa-at' },
]

/**
 * Render settings menu
 */
function SettingsMenu() {
  return (
    <div className="SettingsMenu fade-in">
      {links.map(({ title, to, icon }) => (
        <ButtonLink
          key={to}
          title={title}
          to={to}
          icon={icon}
          className="SettingsMenu__link"
          activeClass="SettingsMenu__link--active"
          text
        />
      ))}
      <ButtonLink
        title="All good"
        to="/"
        icon="fas fa-check"
        className="SettingsMenu__close is-hidden-mobile"
        primary
      />
    </div>
  )
}

export default SettingsMenu
