import { Header, BackToTop, Message } from 'components'
import { Content } from 'components/content'
import { Filters } from 'components/filters'
import {
  SettingsModalContainer,
  ResetModalContainer,
  PlaylistModalContainer,
} from 'components/modals'

/**
 * Main app component
 *
 * @param {RouteComponentProps} props
 */
function App(props) {
  return (
    <div className="App has-background-black has-text-weight-semibold">
      <Header />
      <Filters />
      <Content />
      <BackToTop />
      <Message />
      <SettingsModalContainer />
      <ResetModalContainer />
      <PlaylistModalContainer />
    </div>
  )
}

export default App
