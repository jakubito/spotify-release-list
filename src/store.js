import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import localForage from 'localforage';
import * as Sentry from '@sentry/browser';
import createSagaMiddleware from 'redux-saga';
import {
  SYNC,
  SYNC_FINISHED,
  SYNC_FINISHED_WITH_ERROR,
  SET_USER,
  ADD_ALBUMS,
  SET_ARTISTS,
  RESET,
  SET_SETTINGS,
  SHOW_SETTINGS_MODAL,
  HIDE_SETTINGS_MODAL,
  SHOW_RESET_MODAL,
  HIDE_RESET_MODAL,
  SHOW_PLAYLIST_MODAL,
  HIDE_PLAYLIST_MODAL,
  SET_TOKEN,
  SET_NONCE,
  SHOW_ERROR_MESSAGE,
  HIDE_ERROR_MESSAGE,
} from './actions';
import saga from './sagas';

localForage.config({
  name: 'spotify-release-list',
});

const persistConfig = {
  key: 'root',
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  whitelist: [
    'user',
    'syncedOnce',
    'lastSync',
    'token',
    'tokenExpires',
    'tokenScope',
    'nonce',
    'artists',
    'albums',
    'settings',
  ],
};

const initialState = {
  user: null,
  syncing: false,
  syncedOnce: false,
  lastSync: null,
  token: null,
  tokenExpires: null,
  tokenScope: null,
  nonce: null,
  settingsModalVisible: false,
  resetModalVisible: false,
  playlistModalVisible: false,
  artists: {},
  albums: {},
  errorMessage: null,
  settings: {
    groups: ['album', 'single', 'compilation', 'appears_on'],
    days: 30,
    market: '',
    uriLinks: false,
    covers: true,
  },
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SYNC:
      return {
        ...state,
        syncing: true,
        artists: {},
        albums: {},
      };
    case SYNC_FINISHED:
      return {
        ...state,
        syncing: false,
        syncedOnce: true,
        lastSync: new Date().toISOString(),
      };
    case SYNC_FINISHED_WITH_ERROR:
      return {
        ...state,
        syncing: false,
      };
    case SET_USER:
      return {
        ...state,
        user: payload.user,
      };
    case SET_ARTISTS:
      return {
        ...state,
        artists: payload.artists.reduce(
          (acc, artist) => ({
            ...acc,
            [artist.id]: artist,
          }),
          {}
        ),
      };
    case ADD_ALBUMS:
      return {
        ...state,
        albums: payload.albums.reduce(
          (acc, album) => {
            if (album.releaseDate < payload.afterDateString) {
              return acc;
            }

            const { meta, ...albumRest } = album;

            if (!acc[album.id]) {
              acc[album.id] = albumRest;
            }

            acc[album.id].groups[meta.group] = [...acc[album.id].groups[meta.group], meta.artistId];

            return acc;
          },
          { ...state.albums }
        ),
      };
    case SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...payload.settings,
        },
      };
    case SHOW_SETTINGS_MODAL:
      return {
        ...state,
        settingsModalVisible: true,
        resetModalVisible: false,
      };
    case HIDE_SETTINGS_MODAL:
      return {
        ...state,
        settingsModalVisible: false,
      };
    case SHOW_RESET_MODAL:
      return {
        ...state,
        resetModalVisible: true,
        settingsModalVisible: false,
      };
    case HIDE_RESET_MODAL:
      return {
        ...state,
        resetModalVisible: false,
      };
    case SHOW_PLAYLIST_MODAL:
      return {
        ...state,
        playlistModalVisible: true,
      };
    case HIDE_PLAYLIST_MODAL:
      return {
        ...state,
        playlistModalVisible: false,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: payload.token,
        tokenExpires: payload.tokenExpires,
      };
    case SET_NONCE:
      return {
        ...state,
        syncing: true,
        nonce: payload.nonce,
      };
    case RESET:
      return {
        ...initialState,
        settings: state.settings,
      };
    case SHOW_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: payload.message,
      };
    case HIDE_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: null,
      };
    default:
      return state;
  }
}

const persistedReducer = persistReducer(persistConfig, reducer);
const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    Sentry.captureException(error);
  },
});
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
export const hydrate = new Promise((resolve) => {
  persistStore(store, null, resolve);
});

sagaMiddleware.run(saga);
