import React, { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import Navbar from './Navbar';
import Content from './Content';
import SettingsModalContainer from './modals/SettingsModalContainer';
import ResetModalContainer from './modals/ResetModalContainer';
import BackToTop from './BackToTop';

function App() {
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      throttle(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        setBackToTopVisible(scrollTop > 100);
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
    </div>
  );
}

export default App;
