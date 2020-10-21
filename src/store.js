import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import localForage from 'localforage'
import * as Sentry from '@sentry/browser'
import createSagaMiddleware from 'redux-saga'
import saga from 'sagas'
import migrations from 'migrations'
import reducer from 'reducer'

localForage.config({ name: 'spotify-release-list' })

const persistConfig = {
  key: 'root',
  version: 1,
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations),
  whitelist: [
    'albums',
    'lastSync',
    'previousSyncMaxDate',
    'playlistForm',
    'token',
    'tokenExpires',
    'tokenScope',
    'user',
    'nonce',
    'settings',
    'seenFeatures',
  ],
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware({ onError: Sentry.captureException })

export const store = createStore(
  persistReducer(persistConfig, reducer),
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

export let persistor

export const hydrate = new Promise((resolve) => {
  persistor = persistStore(store, null, resolve)
})

sagaMiddleware.run(saga)
