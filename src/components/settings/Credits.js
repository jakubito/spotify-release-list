import { Address } from 'enums'
import { Anchor, Emoji } from 'components/common'

const { GITHUB_PROFILE, GITHUB, PRIVACY, DONATE } = Address

/**
 * Render all the important links
 */
function Credits() {
  return (
    <div className="has-text-centered has-text-grey">
      Made with <Emoji value="💛" label="heart" /> by{' '}
      <Anchor href={GITHUB_PROFILE} title="My GitHub profile">
        Jakub Dobes
      </Anchor>
      {' - '}
      <Anchor href={GITHUB} title="GitHub repository">
        GitHub
      </Anchor>
      {' - '}
      <Anchor href={PRIVACY} title="Privacy Policy" />
      {' - '}
      <Anchor href={DONATE} title="Contribute via PayPal">
        Donate
      </Anchor>
      {' - '}v{process.env.REACT_APP_VERSION}
    </div>
  )
}

export default Credits
