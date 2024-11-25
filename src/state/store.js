import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import localForage from 'localforage'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'sagas'
import { captureException } from 'helpers'
import migrations from './migrations'
import rootReducer from './reducer'

localForage.config({ name: 'spotify-release-list' })

/** @type {import('redux-persist').PersistConfig<State>} */
const persistConfig = {
  key: 'root',
  version: 8,
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations),
  writeFailHandler: captureException,
  whitelist: [
    'albums',
    'lastSync',
    'lastAutoSync',
    'previousSyncMaxDate',
    'playlistForm',
    'playlists',
    'selectedPlaylistId',
    'lastPlaylistsRefresh',
    'user',
    'settings',
    'filters',
    'filtersVisible',
    'favorites',
  ],
}

const reducer = persistReducer(persistConfig, rootReducer)
const sagaMiddleware = createSagaMiddleware({ onError: captureException })
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(sagaMiddleware),
})

/** @type {Promise<void>} */
export const hydrate = new Promise((resolve) => {
  persistStore(store, null, resolve)
})

sagaMiddleware.run(rootSaga)

export default store
