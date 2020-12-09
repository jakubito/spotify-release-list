import { SyncButton } from 'components/common'

/**
 * Render intro content for new users
 */
function Intro() {
  return (
    <div className="center has-background-black has-text-weight-semibold">
      <p className="has-text-light is-size-5 has-text-centered intro">
        Display list of Spotify releases from artists you follow.
      </p>
      <SyncButton title="Log in with Spotify" icon="fab fa-spotify" medium />
      <a
        href="https://github.com/jakubito/spotify-release-list/blob/master/PRIVACY.md"
        className="has-text-grey-light privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>
    </div>
  )
}

export default Intro
