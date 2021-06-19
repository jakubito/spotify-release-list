import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import localForage from 'localforage'
import * as Sentry from '@sentry/browser'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'sagas'
import migrations from './migrations'
import rootReducer from './reducer'

localForage.config({ name: 'spotify-release-list' })

/** @type {import('redux-persist').PersistConfig<State>} */
const persistConfig = {
  key: 'root',
  version: 5,
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations),
  whitelist: [
    'authData',
    'albums',
    'lastSync',
    'lastAutoSync',
    'previousSyncMaxDate',
    'playlistForm',
    'user',
    'settings',
    'filters',
    'filtersVisible',
    'seenFeatures',
  ],
}

const composeEnhancers = /** @type {any} */ (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware({ onError: (error) => Sentry.captureException(error) })

/** @type {import('redux').Store<State>} */
const store = createStore(
  persistReducer(persistConfig, rootReducer),
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

/** @type {import('redux-persist').Persistor} */
export let persistor

/** @type {Promise<void>} */
export const hydrate = new Promise((resolve) => {
  persistor = persistStore(store, null, resolve)
})

sagaMiddleware.run(rootSaga)

export default store
