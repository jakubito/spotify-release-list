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
      <Outlet />
      <BackToTop />
      <Message />
      <UpdateMessage />
    </div>
  )
}

export default App
