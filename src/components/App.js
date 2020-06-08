import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSettings } from 'selectors';
import { Theme } from 'enums';
import Navbar from './Navbar';
import Content from './Content';
import SettingsModalContainer from './modals/SettingsModalContainer';
import ResetModalContainer from './modals/ResetModalContainer';
import PlaylistModalContainer from './modals/PlaylistModalContainer';
import BackToTop from './BackToTop';
import Error from './Error';

function useTheme() {
  const { theme } = useSelector(getSettings);
  const themes = useMemo(() => Object.values(Theme), []);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      // Theme already applied before first render, skip effect
      firstRender.current = false;

      return;
    }

    document.documentElement.classList.remove(...themes);

    if (theme) {
      document.documentElement.classList.add(...theme.split(' '));
    }
  }, [theme]);
}

function App() {
  useTheme();

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
