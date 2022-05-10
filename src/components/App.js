import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BackToTop, Message, UpdateMessage } from 'components/common'

/**
 * Main app component
 */
function App() {
  const location = useLocation()

  useLayoutEffect(() => window.scrollTo(0, 0), [location])

  return (
    <div className="App">
      <div id="demo">
        This is a demo version. For a full version, visit{' '}
        <a href="https://spotifyreleaselist.netlify.app/" title="Spotify Release List">
          spotifyreleaselist.netlify.app
        </a>
      </div>
      <Outlet />
      <BackToTop />
      <Message />
      <UpdateMessage />
    </div>
  )
}

export default App
