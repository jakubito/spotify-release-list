import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import moment from 'moment'
import 'react-dates/initialize'
import * as serviceWorkerRegistration from 'serviceWorkerRegistration'
import { store, hydrate } from 'state'
import { albumsNew, albumsHistory } from 'albums'
import { getSettings } from 'state/selectors'
import { Routes } from 'components'
import 'styles/index.scss'

serviceWorkerRegistration.unregister()

const init = Promise.all([hydrate, albumsNew.load(), albumsHistory.load()])
const container = document.getElementById('root')
const root = createRoot(container)

init.then(() => {
  const { theme, firstDayOfWeek } = getSettings(store.getState())

  if (theme) document.documentElement.classList.add(...theme.split(' '))
  moment.updateLocale(moment.locale(), { week: { dow: firstDayOfWeek } })

  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  )
})
