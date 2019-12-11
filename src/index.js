import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
import Auth from './components/Auth';
import App from './components/App';
import { store, hydrate } from './store';
import './styles/index.scss';

(async function() {
  await hydrate;

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Auth path="auth" />
        <App path="/" />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
})();
