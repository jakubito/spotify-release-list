import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import PWAPrompt from 'react-ios-pwa-prompt'
import * as Sentry from '@sentry/browser'
import moment from 'moment'
import 'react-dates/initialize'
import * as serviceWorkerRegistration from 'serviceWorkerRegistration'
import { store, hydrate } from 'state'
import { getSettings, getSettingsTheme } from 'state/selectors'
import { updateReady } from 'state/actions'
import { Routes } from 'components'
import 'styles/index.scss'

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN })
serviceWorkerRegistration.register({ onUpdate: () => store.dispatch(updateReady()) })

hydrate.then(applyTheme).then(setFirstDayOfWeek).then(renderApp)

function applyTheme() {
  const theme = getSettingsTheme(store.getState())

  if (theme) {
    document.documentElement.classList.add(...theme.split(' '))
  }
}

function setFirstDayOfWeek() {
  const { firstDayOfWeek } = getSettings(store.getState())

  moment.updateLocale(moment.locale(), { week: { dow: firstDayOfWeek } })
}

function renderApp() {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
        <PWAPrompt />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )
}
