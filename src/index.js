import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Redirect } from '@reach/router';
import Auth from './components/Auth';
import App from './components/App';
import { store, hydrate } from './store';
import '@fortawesome/fontawesome-free/js/all';
import './styles/index.scss';

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
