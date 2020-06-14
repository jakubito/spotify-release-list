import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Redirect } from '@reach/router';
import * as Sentry from '@sentry/browser';
import '@fortawesome/fontawesome-free/js/all';
import 'react-dates/initialize';
import Auth from 'components/Auth';
import App from 'components/App';
import { store, hydrate } from 'store';
import { getSettingsTheme } from 'selectors';
import 'styles/index.scss';

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });

function applyTheme() {
  const theme = getSettingsTheme(store.getState());

  if (theme) {
    document.documentElement.classList.add(...theme.split(' '));
  }
}

function renderApp() {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Auth path="auth" />
        <App path="/" />
        <Redirect from="/*" to="/" default noThrow />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}

hydrate.then(applyTheme).then(renderApp);
