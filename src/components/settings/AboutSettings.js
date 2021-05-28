import { Address } from 'enums'
import { Anchor, ButtonAnchor, Emoji, VerticalLayout } from 'components/common'

const { GITHUB_PROFILE, DONATE, GITHUB, PRIVACY, CREDITS, CHANGELOG } = Address

/**
 * Render about section
 *
 * @param {RouteComponentProps} props
 */
function AboutSettings(props) {
  return (
    <VerticalLayout className="AboutSettings">
      <div className="AboutSettings__item">
        Made with <Emoji value="💛" label="heart" /> by{' '}
        <Anchor href={GITHUB_PROFILE} title="My GitHub profile">
          Jakub Dobes
        </Anchor>
      </div>
      <ButtonAnchor
        href={GITHUB}
        title="GitHub repository"
        icon="fab fa-github"
        className="AboutSettings__item"
      >
        GitHub
      </ButtonAnchor>
      <ButtonAnchor
        href={DONATE}
        title="Contribute via PayPal"
        icon="fas fa-mug-hot"
        className="AboutSettings__item"
      >
        Donate
      </ButtonAnchor>
      <ButtonAnchor
        href={PRIVACY}
        title="Privacy Policy"
        icon="fas fa-user-shield"
        className="AboutSettings__item"
      />
      <ButtonAnchor
        href={CREDITS}
        title="Credits"
        icon="fas fa-fire"
        className="AboutSettings__item"
      />
      <ButtonAnchor
        href={CHANGELOG}
        title="Changelog"
        icon="fas fa-star"
        className="AboutSettings__item"
      />
      <div className="AboutSettings__item has-text-grey-light">
        Version {process.env.REACT_APP_VERSION}
      </div>
    </VerticalLayout>
  )
}

export default AboutSettings
