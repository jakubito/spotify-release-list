import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Redirect } from '@reach/router'
import PWAPrompt from 'react-ios-pwa-prompt'
import * as Sentry from '@sentry/browser'
import moment from 'moment'
import 'react-dates/initialize'
import * as serviceWorkerRegistration from 'serviceWorkerRegistration'
import { store, hydrate } from 'state'
import { getSettings, getSettingsTheme } from 'state/selectors'
import { updateReady } from 'state/actions'
import { Auth, App } from 'components'
import { Releases } from 'components/releases'
import {
  Settings,
  GeneralSettings,
  AppearanceSettings,
  AboutSettings,
  AutomationSettings,
  BackupSettings,
} from 'components/settings'
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
      <Router>
        <App path="/">
          <Releases path="/" />
          <Settings path="settings">
            <GeneralSettings path="/" />
            <AppearanceSettings path="appearance" />
            <AutomationSettings path="automation" />
            <BackupSettings path="backup" />
            <AboutSettings path="about" />
            <Redirect from="*" to="/" noThrow />
          </Settings>
          <Redirect from="*" to="/" noThrow />
        </App>
        <Auth path="auth" />
      </Router>
      <PWAPrompt />
    </Provider>,
    document.getElementById('root')
  )
}
