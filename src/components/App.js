import React, { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import Navbar from './Navbar';
import Content from './Content';
import SettingsModalContainer from './modals/SettingsModalContainer';
import ResetModalContainer from './modals/ResetModalContainer';
import PlaylistModalContainer from './modals/PlaylistModalContainer';
import BackToTop from './BackToTop';
import Error from './Error';

function App() {
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      throttle(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        setBackToTopVisible(scrollTop > 200);
      }, 200)
    );
  }, [setBackToTopVisible]);

  return (
    <div className="App has-background-black has-text-weight-semibold">
      <Navbar />
      <Content />
      <BackToTop className={classNames({ visible: backToTopVisible })} />
      <SettingsModalContainer />
      <ResetModalContainer />
      <PlaylistModalContainer />
      <Error />
    </div>
  );
}

export default App;
