import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import { getSettings } from 'selectors';
import { Theme } from 'enums';
import Navbar from './Navbar';
import Content from './Content';
import SettingsModalContainer from './modals/SettingsModalContainer';
import ResetModalContainer from './modals/ResetModalContainer';
import PlaylistModalContainer from './modals/PlaylistModalContainer';
import BackToTop from './BackToTop';
import Error from './Error';

const themeValues = Object.values(Theme);

function useBackToTop() {
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      throttle(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        setBackToTopVisible(scrollTop > 200);
      }, 200)
    );
  }, []);

  return backToTopVisible;
}

function useTheme() {
  const { theme } = useSelector(getSettings);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      // Theme already applied before first render, skip effect
      firstRender.current = false;

      return;
    }

    document.documentElement.classList.remove(...themeValues);

    if (theme) {
      document.documentElement.classList.add(...theme.split(' '));
    }
  }, [theme]);
}

function App() {
  const backToTopVisible = useBackToTop();

  useTheme();

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
