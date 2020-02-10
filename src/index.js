import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Redirect } from '@reach/router';
import * as Sentry from '@sentry/browser';
import '@fortawesome/fontawesome-free/js/all';
import 'react-dates/initialize';
import Auth from './components/Auth';
import App from './components/App';
import { store, hydrate } from './store';
import './styles/index.scss';

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });

(async function() {
  await hydrate;

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
})();
