import { BackToTop, Message } from 'components/common'

/**
 * Main app component
 *
 * @param {RouteComponentProps & { children: React.ReactNode }} props
 */
function App({ children }) {
  return (
    <div className="App">
      {children}
      <BackToTop />
      <Message />
    </div>
  )
}

export default App
