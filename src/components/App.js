import React from 'react';
import Navbar from './Navbar';
import Content from './Content';
import SettingsModalContainer from './modals/SettingsModalContainer';
import ResetModalContainer from './modals/ResetModalContainer';
import PlaylistModalContainer from './modals/PlaylistModalContainer';
import BackToTop from './BackToTop';
import Error from './Error';

function App() {
  return (
    <div className="App has-background-black has-text-weight-semibold">
      <Navbar />
      <Content />
      <BackToTop />
      <SettingsModalContainer />
      <ResetModalContainer />
      <PlaylistModalContainer />
      <Error />
    </div>
  );
}

export default App;
