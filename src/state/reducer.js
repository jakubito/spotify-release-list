import { AlbumGroup, GroupColorSchemes } from 'enums'
import {
  AUTHORIZE_START,
  AUTHORIZE_FINISHED,
  AUTHORIZE_ERROR,
  SYNC_START,
  SYNC_FINISHED,
  SYNC_ERROR,
  SYNC_CANCEL,
  SET_SYNCING_PROGRESS,
  SET_USER,
  SET_ALBUMS,
  RESET,
  SET_SETTINGS,
  SHOW_PLAYLIST_MODAL,
  HIDE_PLAYLIST_MODAL,
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
  UPDATE_READY,
  DISMISS_UPDATE,
  TOGGLE_EDITING_FAVORITES,
  SET_FAVORITE,
  SET_FAVORITE_ALL,
  SET_FAVORITE_NONE,
} from 'state/actions'
import { buildAlbumsMap, mergeAlbumsRaw } from 'state/helpers'
import { getAlbumsArray, getFilteredAlbumsArray, getFiltersApplied } from 'state/selectors'

/** @type {State} */
export const INITIAL_STATE = {
  authorizing: false,
  albums: {},
  syncing: false,
  syncingProgress: 0,
  lastSync: null,
  lastAutoSync: null,
  previousSyncMaxDate: null,
  creatingPlaylist: false,
  playlistId: null,
  playlistForm: {
    name: null,
    description: null,
    isPrivate: null,
  },
  user: null,
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
    autoSync: false,
    autoSyncTime: '08:00',
    notifications: true,
  },
  filters: {
    groups: [],
    search: '',
    startDate: null,
    endDate: null,
    excludeVariousArtists: false,
    excludeRemixes: false,
    excludeDuplicates: false,
    favoritesOnly: false,
  },
  seenFeatures: [],
  updateReady: false,
  favorites: {},
  editingFavorites: false,
}

/**
 * State root reducer
 *
 * @param {State} state
 * @param {Action} action
 * @returns {State}
 */
function rootReducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case AUTHORIZE_START:
      return { ...state, authorizing: true }
    case AUTHORIZE_FINISHED:
    case AUTHORIZE_ERROR:
      return { ...state, authorizing: false }
    case SYNC_START:
      return {
        ...state,
        syncing: true,
        syncingProgress: 0,
        filtersVisible: false,
        editingFavorites: false,
        filters: {
          ...INITIAL_STATE.filters,
          excludeVariousArtists: state.filters.excludeVariousArtists,
          excludeRemixes: state.filters.excludeRemixes,
          excludeDuplicates: state.filters.excludeDuplicates,
        },
      }
    case SYNC_FINISHED:
      return {
        ...state,
        syncing: false,
        favorites: {},
        previousSyncMaxDate: payload.previousSyncMaxDate,
        [payload.auto ? 'lastAutoSync' : 'lastSync']: new Date().toISOString(),
      }
    case SYNC_ERROR:
    case SYNC_CANCEL:
      return { ...state, syncing: false }
    case SET_SYNCING_PROGRESS:
    case SET_USER:
      return { ...state, ...payload }
    case SET_ALBUMS:
      return setAlbumsReducer(state, payload)
    case SET_SETTINGS:
      return { ...state, settings: { ...state.settings, ...payload.settings } }
    case SHOW_PLAYLIST_MODAL:
      return { ...state, playlistModalVisible: true }
    case HIDE_PLAYLIST_MODAL:
      return { ...state, playlistModalVisible: false, playlistId: INITIAL_STATE.playlistId }
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
      return { ...state, playlistId: INITIAL_STATE.playlistId }
    case ADD_SEEN_FEATURE:
      return { ...state, seenFeatures: [...state.seenFeatures, payload.feature] }
    case TOGGLE_FILTERS_VISIBLE:
      return { ...state, filtersVisible: !state.filtersVisible }
    case SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...payload.filters } }
    case RESET_FILTERS:
      return { ...state, filters: INITIAL_STATE.filters }
    case UPDATE_READY:
      return { ...state, updateReady: true }
    case DISMISS_UPDATE:
      return { ...state, updateReady: false }
    case SET_FAVORITE:
      return { ...state, favorites: { ...state.favorites, [payload.id]: payload.selected } }
    case SET_FAVORITE_ALL:
      return setFavoriteMassReducer(state, true)
    case SET_FAVORITE_NONE:
      return setFavoriteMassReducer(state, false)
    case TOGGLE_EDITING_FAVORITES:
      return { ...state, editingFavorites: !state.editingFavorites }
    case RESET:
      return INITIAL_STATE
    default:
      return state
  }
}

/**
 * Albums reducer
 *
 * @param {State} state
 * @param {{ albumsRaw: AlbumRaw[], artists: Artist[], minDate: string }} payload
 * @returns {State}
 */
export function setAlbumsReducer(state, { albumsRaw, artists, minDate }) {
  const albumsRawMerged = mergeAlbumsRaw(albumsRaw, minDate)
  const albums = buildAlbumsMap(albumsRawMerged, artists)

  return { ...state, albums }
}

/**
 * Mass select favorites reducer
 *
 * @param {State} state
 * @param {boolean} selected
 * @returns {State}
 */
export function setFavoriteMassReducer(state, selected) {
  const filtersApplied = getFiltersApplied(state)
  const albums = filtersApplied ? getFilteredAlbumsArray(state) : getAlbumsArray(state)
  const favorites = albums.reduce(
    (map, album) => {
      map[album.id] = selected
      return map
    },
    { ...state.favorites }
  )

  return { ...state, favorites }
}

export default rootReducer
