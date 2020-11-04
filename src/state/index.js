import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import localForage from 'localforage'
import * as Sentry from '@sentry/browser'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'sagas'
import migrations from 'state/migrations'
import rootReducer from 'state/reducer'
import actionGuardMiddleware from 'state/guards'
import { AlbumGroup } from 'enums'

/** @type {State} */
export const initialState = {
  albums: {},
  syncing: false,
  syncingProgress: 0,
  lastSync: null,
  previousSyncMaxDate: null,
  creatingPlaylist: false,
  playlistId: null,
  playlistForm: {
    albumIds: null,
    name: null,
    description: null,
    isPrivate: null,
  },
  token: null,
  tokenExpires: null,
  tokenScope: null,
  user: null,
  nonce: null,
  errorMessage: null,
  settingsModalVisible: false,
  resetModalVisible: false,
  playlistModalVisible: false,
  settings: {
    groups: Object.values(AlbumGroup),
    days: 30,
    market: '',
    theme: '',
    uriLinks: false,
    covers: true,
  },
  seenFeatures: [],
}

localForage.config({ name: 'spotify-release-list' })

/** @type {import('redux-persist').PersistConfig<State>} */
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

const composeEnhancers = /** @type {any} */ (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware({ onError: (error) => Sentry.captureException(error) })

/** @type {import('redux').Store<State>} */
export const store = createStore(
  persistReducer(persistConfig, rootReducer),
  composeEnhancers(applyMiddleware(actionGuardMiddleware, sagaMiddleware))
)

/** @type {import('redux-persist').Persistor} */
export let persistor

/** @type {Promise<void>} */
export const hydrate = new Promise((resolve) => {
  persistor = persistStore(store, null, resolve)
})

sagaMiddleware.run(rootSaga)
