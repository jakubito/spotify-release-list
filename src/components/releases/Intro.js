import { Address } from 'enums'
import { Anchor, SyncButton } from 'components/common'

const { GITHUB, PRIVACY } = Address

/**
 * Render intro content for new users
 */
function Intro() {
  return (
    <div className="center has-background-black has-text-weight-semibold">
      <p className="has-text-light is-size-5 has-text-centered intro">
        Display releases from artists you follow
      </p>
      <SyncButton title="Log in with Spotify" icon="fab fa-spotify" medium />
      <div className="links has-text-centered has-text-grey">
        <Anchor href={GITHUB} title="GitHub repository">
          GitHub
        </Anchor>
        {' - '}
        <Anchor href={PRIVACY} title="Privacy Policy" />
      </div>
    </div>
  )
}

export default Intro
