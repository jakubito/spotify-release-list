import { BackToTop, Message } from 'components/common'

/**
 * Main app component
 *
 * @param {{ children: React.ReactNode } & RouteComponentProps} props
 */
function App({ children }) {
  return (
    <div className="App has-background-black has-text-weight-medium">
      {children}
      <BackToTop />
      <Message />
    </div>
  )
}

export default App
