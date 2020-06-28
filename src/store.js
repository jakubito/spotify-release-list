import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import localForage from 'localforage';
import * as Sentry from '@sentry/browser';
import createSagaMiddleware from 'redux-saga';
import {
  SYNC,
  SYNC_FINISHED,
  SYNC_ERROR,
  SET_SYNCING,
  SET_SYNCING_PROGRESS,
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
  SET_PLAYLIST_FORM,
  CREATE_PLAYLIST,
  CREATE_PLAYLIST_FINISHED,
  CREATE_PLAYLIST_ERROR,
  CREATE_PLAYLIST_CANCEL,
  RESET_PLAYLIST,
  ADD_SEEN_FEATURE,
} from 'actions';
import saga from 'sagas';
import migrations from 'migrations';
import { AlbumGroup } from 'enums';

localForage.config({
  name: 'spotify-release-list',
});

const persistConfig = {
  key: 'root',
  version: 0,
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations),
  whitelist: [
    'artists',
    'albums',
    'lastSync',
    'playlistForm',
    'token',
    'tokenExpires',
    'tokenScope',
    'user',
    'nonce',
    'settings',
    'seenFeatures',
  ],
};

const initialState = {
  artists: {},
  albums: {},
  syncing: false,
  syncingProgress: 0,
  lastSync: null,
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
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SYNC:
      return {
        ...state,
        syncing: true,
        syncingProgress: 0,
        artists: {},
        albums: {},
      };
    case SYNC_FINISHED:
      return {
        ...state,
        syncing: false,
        lastSync: new Date().toISOString(),
      };
    case SYNC_ERROR:
      return {
        ...state,
        syncing: false,
      };
    case SET_SYNCING:
      return {
        ...state,
        syncing: payload.syncing,
      };
    case SET_SYNCING_PROGRESS:
      return {
        ...state,
        syncingProgress: payload.syncingProgress,
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
            if (album.releaseDate < payload.minDate) {
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
        playlistId: initialState.playlistId,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: payload.token,
        tokenExpires: payload.tokenExpires,
        tokenScope: payload.tokenScope,
      };
    case SET_NONCE:
      return {
        ...state,
        nonce: payload.nonce,
      };
    case RESET:
      return {
        ...initialState,
        settings: state.settings,
        seenFeatures: state.seenFeatures,
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
    case SET_PLAYLIST_FORM:
      return {
        ...state,
        playlistForm: {
          albumIds: payload.albumIds,
          name: payload.name,
          description: payload.description,
          isPrivate: payload.isPrivate,
        },
      };
    case CREATE_PLAYLIST:
      return {
        ...state,
        creatingPlaylist: true,
        playlistModalVisible: true,
      };
    case CREATE_PLAYLIST_FINISHED:
      return {
        ...state,
        creatingPlaylist: false,
        playlistId: payload.id,
      };
    case CREATE_PLAYLIST_ERROR:
      return {
        ...state,
        creatingPlaylist: false,
      };
    case CREATE_PLAYLIST_CANCEL:
      return {
        ...state,
        creatingPlaylist: false,
      };
    case RESET_PLAYLIST:
      return {
        ...state,
        playlistId: initialState.playlistId,
      };
    case ADD_SEEN_FEATURE:
      return {
        ...state,
        seenFeatures: [...state.seenFeatures, payload.feature],
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

export let persistor;

export const hydrate = new Promise((resolve) => {
  persistor = persistStore(store, null, resolve);
});

sagaMiddleware.run(saga);
