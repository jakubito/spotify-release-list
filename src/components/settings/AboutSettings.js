import { Address } from 'enums'
import { Anchor, ButtonAnchor, Emoji, VerticalLayout } from 'components/common'

const { GITHUB_PROFILE, DONATE, EMAIL, GITHUB, PRIVACY, CREDITS, CHANGELOG } = Address

/**
 * Render about section
 */
function AboutSettings() {
  return (
    <VerticalLayout className="AboutSettings fade-in">
      <div className="AboutSettings__item">
        Made with <Emoji value="💛" label="heart" /> by{' '}
        <Anchor href={GITHUB_PROFILE} title="My GitHub profile" className="has-text-white">
          Jakub Dobes
        </Anchor>
      </div>
      <div className="AboutSettings__item AboutSettings__buttons">
        <ButtonAnchor
          href={GITHUB}
          title="GitHub repository"
          icon="fab fa-github"
          className="AboutSettings__button"
        >
          GitHub
        </ButtonAnchor>
        <ButtonAnchor
          href={DONATE}
          title="Contribute via PayPal"
          icon="fas fa-mug-hot"
          className="AboutSettings__button"
        >
          Donate
        </ButtonAnchor>
        <ButtonAnchor
          href={EMAIL}
          title="E-mail"
          icon="fas fa-envelope"
          className="AboutSettings__button"
        />
        <ButtonAnchor
          href={PRIVACY}
          title="Privacy Policy"
          icon="fas fa-user-shield"
          className="AboutSettings__button"
        />
        <ButtonAnchor
          href={CREDITS}
          title="Credits"
          icon="fas fa-magic"
          className="AboutSettings__button"
        />
        <ButtonAnchor
          href={CHANGELOG}
          title="Changelog"
          icon="fas fa-star"
          className="AboutSettings__button"
        />
      </div>
      <div className="AboutSettings__item">
        Spotify is a trademark of Spotify AB. This app is not affiliated with Spotify.
      </div>
      <div className="AboutSettings__item">
        <span className="icon">
          <i className="fas fa-code-branch" />
        </span>{' '}
        Version {process.env.REACT_APP_VERSION} ({process.env.REACT_APP_GIT_SHA})
      </div>
    </VerticalLayout>
  )
}

export default AboutSettings
