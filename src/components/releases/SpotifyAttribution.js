import classNames from 'classnames'

/**
 * @param {{ className?: string }} props
 */
function SpotifyAttribution({ className }) {
  return (
    <div className={classNames('SpotifyAttribution', className)}>
      <a
        className="SpotifyAttribution__link"
        href="https://www.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Spotify"
      >
        Content provided by
        <i className="SpotifyAttribution__icon fab fa-spotify" aria-hidden="true" />
        Spotify
      </a>
    </div>
  )
}

export default SpotifyAttribution
