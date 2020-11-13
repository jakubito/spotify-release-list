import React from 'react'
import Header from 'components/Header'
import Filters from 'components/filters'
import Content from 'components/Content'
import SettingsModalContainer from 'components/modals/SettingsModalContainer'
import ResetModalContainer from 'components/modals/ResetModalContainer'
import PlaylistModalContainer from 'components/modals/PlaylistModalContainer'
import BackToTop from 'components/BackToTop'
import Error from 'components/Error'

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
      <SettingsModalContainer />
      <ResetModalContainer />
      <PlaylistModalContainer />
      <Error />
    </div>
  )
}

export default App
