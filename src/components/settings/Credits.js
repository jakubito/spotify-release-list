import React from 'react'

function Link({ children, ...props }) {
  return (
    <a className="has-text-grey-light" target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

function Bullet() {
  return ' - '
}

function Credits(props) {
  return (
    <div className="credits has-text-centered has-text-grey">
      Made with{' '}
      <span role="img" aria-label="heart emoji">
        💛
      </span>{' '}
      by{' '}
      <Link href="https://github.com/jakubito" title="My Github">
        Jakub Dobes
      </Link>
      <Bullet />
      <Link href="https://github.com/jakubito/spotify-release-list" title="Source code on Github">
        Github
      </Link>
      <Bullet />
      <Link
        href="https://github.com/jakubito/spotify-release-list/blob/master/PRIVACY.md"
        title="Privacy Policy"
      >
        Privacy Policy
      </Link>
      <Bullet />
      <Link href="https://paypal.me/jakubito" title="Contribute via PayPal">
        Donate
      </Link>
      <Bullet />v{process.env.REACT_APP_VERSION}
    </div>
  )
}

export default Credits
