import { useEffect } from 'react'
import { BackToTop, Message } from 'components/common'

/**
 * Main app component
 *
 * @param {RouteComponentProps & { children: React.ReactNode }} props
 */
function App({ location, children }) {
  useEffect(() => window.scrollTo(0, 0), [location])

  return (
    <div className="App">
      {children}
      <BackToTop />
      <Message />
    </div>
  )
}

export default App
