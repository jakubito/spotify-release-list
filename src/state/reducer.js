import { AlbumGroup, GroupColorSchemes } from 'enums'
import {
  SYNC_START,
  SYNC_FINISHED,
  SYNC_ERROR,
  SYNC_CANCEL,
  SET_SYNCING,
  SET_SYNCING_PROGRESS,
  SET_USER,
  SET_ALBUMS,
  RESET,
  SET_SETTINGS,
  SHOW_PLAYLIST_MODAL,
  HIDE_PLAYLIST_MODAL,
  SET_TOKEN,
  SET_NONCE,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  SET_PLAYLIST_FORM,
  CREATE_PLAYLIST_START,
  CREATE_PLAYLIST_FINISHED,
  CREATE_PLAYLIST_ERROR,
  CREATE_PLAYLIST_CANCEL,
  RESET_PLAYLIST,
  ADD_SEEN_FEATURE,
  TOGGLE_FILTERS_VISIBLE,
  SET_FILTERS,
  RESET_FILTERS,
} from 'state/actions'
import { buildAlbumsMap, mergeAlbumsRaw } from './helpers'

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
    name: null,
    description: null,
    isPrivate: null,
  },
  token: null,
  tokenExpires: null,
  tokenScope: null,
  user: null,
  nonce: null,
  message: null,
  playlistModalVisible: false,
  filtersVisible: false,
  settings: {
    groups: Object.values(AlbumGroup),
    groupColors: GroupColorSchemes.DEFAULT,
    days: 30,
    market: '',
    theme: '',
    uriLinks: false,
    covers: true,
  },
  filters: {
    groups: [],
    search: '',
    startDate: null,
    endDate: null,
    excludeVariousArtists: false,
  },
  seenFeatures: [],
}

/**
 * State root reducer
 *
 * @param {State} state
 * @param {Action} action
 * @returns {State}
 */
function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SYNC_START:
      return {
        ...state,
        syncing: true,
        syncingProgress: 0,
        filtersVisible: false,
        filters: {
          ...initialState.filters,
          excludeVariousArtists: state.filters.excludeVariousArtists,
        },
      }
    case SYNC_FINISHED:
      return { ...state, ...payload, syncing: false, lastSync: new Date().toISOString() }
    case SYNC_ERROR:
    case SYNC_CANCEL:
      return { ...state, syncing: false }
    case SET_SYNCING:
    case SET_SYNCING_PROGRESS:
    case SET_USER:
    case SET_TOKEN:
    case SET_NONCE:
      return { ...state, ...payload }
    case SET_ALBUMS:
      return setAlbums(state, payload)
    case SET_SETTINGS:
      return { ...state, settings: { ...state.settings, ...payload.settings } }
    case SHOW_PLAYLIST_MODAL:
      return { ...state, playlistModalVisible: true }
    case HIDE_PLAYLIST_MODAL:
      return { ...state, playlistModalVisible: false, playlistId: initialState.playlistId }
    case RESET:
      return { ...initialState, settings: state.settings, seenFeatures: state.seenFeatures }
    case SHOW_MESSAGE:
      return { ...state, message: { ...payload } }
    case HIDE_MESSAGE:
      return { ...state, message: null }
    case SET_PLAYLIST_FORM:
      return { ...state, playlistForm: { ...payload } }
    case CREATE_PLAYLIST_START:
      return { ...state, creatingPlaylist: true, playlistModalVisible: true }
    case CREATE_PLAYLIST_FINISHED:
      return { ...state, creatingPlaylist: false, playlistId: payload.id }
    case CREATE_PLAYLIST_ERROR:
    case CREATE_PLAYLIST_CANCEL:
      return { ...state, creatingPlaylist: false }
    case RESET_PLAYLIST:
      return { ...state, playlistId: initialState.playlistId }
    case ADD_SEEN_FEATURE:
      return { ...state, seenFeatures: [...state.seenFeatures, payload.feature] }
    case TOGGLE_FILTERS_VISIBLE:
      return { ...state, filtersVisible: !state.filtersVisible }
    case SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...payload.filters } }
    case RESET_FILTERS:
      return { ...state, filters: initialState.filters, filtersVisible: false }
    default:
      return state
  }
}

/**
 * @param {State} state
 * @param {{ albumsRaw: AlbumRaw[], artists: Artist[], minDate: string }} payload
 * @returns {State}
 */
function setAlbums(state, { albumsRaw, artists, minDate }) {
  const albumsRawMerged = mergeAlbumsRaw(albumsRaw, minDate)
  const albums = buildAlbumsMap(albumsRawMerged, artists)

  return { ...state, albums }
}

export default rootReducer
