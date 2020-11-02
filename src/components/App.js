import React from 'react'
import Header from './header/Header'
import Content from './Content'
import SettingsModalContainer from './modals/SettingsModalContainer'
import ResetModalContainer from './modals/ResetModalContainer'
import PlaylistModalContainer from './modals/PlaylistModalContainer'
import BackToTop from './BackToTop'
import Error from './Error'

/**
 * Main app component
 *
 * @param {RouteComponentProps} props
 */
function App(props) {
  return (
    <div className="App has-background-black has-text-weight-semibold">
      <Header />
      <Content />
      <BackToTop />
      <SettingsModalContainer />
      <ResetModalContainer />
      <PlaylistModalContainer />
      <Error />
    </div>
  )
}

export default App
