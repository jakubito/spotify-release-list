/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import { hideSettingsModal, hideResetModal } from './actions';
import App from './components/App';
import './styles/index.scss';

const store = new Store();

async function renderApp() {
  await store.ready();
  await store.dispatch(hideSettingsModal());
  await store.dispatch(hideResetModal());

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}

chrome.runtime.sendMessage({ type: 'READY' }, renderApp);
