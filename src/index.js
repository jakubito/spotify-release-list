import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Redirect } from '@reach/router'
import PWAPrompt from 'react-ios-pwa-prompt'
import * as Sentry from '@sentry/browser'
import '@fortawesome/fontawesome-free/js/all'
import 'react-dates/initialize'
import * as serviceWorker from 'serviceWorker'
import { store, hydrate } from 'state'
import { getSettingsTheme } from 'selectors'
import Auth from 'components/Auth'
import App from 'components/App'
import 'styles/index.scss'

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN })
serviceWorker.register()

function applyTheme() {
  const theme = getSettingsTheme(store.getState())

  if (theme) {
    document.documentElement.classList.add(...theme.split(' '))
  }
}

function renderApp() {
  render(
    <>
      <Provider store={store}>
        <Router>
          <Auth path="auth" />
          <App path="/" />
          <Redirect from="/*" to="/" default noThrow />
        </Router>
      </Provider>
      <PWAPrompt />
    </>,
    document.getElementById('root')
  )
}

hydrate.then(applyTheme).then(renderApp)
