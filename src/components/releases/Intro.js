import { Address } from 'enums'
import { ButtonAnchor, SyncButton } from 'components/common'

const { GITHUB, PRIVACY } = Address

/**
 * Render initial intro screen
 */
function Intro() {
  return (
    <div className="Intro has-background-black has-text-weight-semibold">
      <p className="Intro__description has-text-light is-size-5 has-text-centered">
        Display releases from artists you follow
      </p>
      <SyncButton title="Log in with Spotify" icon="fab fa-spotify" medium />
      <div className="Intro__buttons has-text-centered has-text-grey">
        <ButtonAnchor
          href={GITHUB}
          title="GitHub repository"
          icon="fab fa-github"
          className="Intro__button"
          text
        >
          GitHub
        </ButtonAnchor>
        <ButtonAnchor
          href={PRIVACY}
          title="Privacy Policy"
          icon="fas fa-user-shield"
          className="Intro__button"
          text
        />
      </div>
    </div>
  )
}

export default Intro
