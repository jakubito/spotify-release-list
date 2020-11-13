import orderBy from 'lodash/orderBy'
import { initialState } from 'state'
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
        filters: initialState.filters,
        filtersVisible: false,
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
    case SHOW_SETTINGS_MODAL:
      return { ...hideModals(state), settingsModalVisible: true }
    case SHOW_RESET_MODAL:
      return { ...hideModals(state), resetModalVisible: true }
    case SHOW_PLAYLIST_MODAL:
      return { ...hideModals(state), playlistModalVisible: true }
    case HIDE_SETTINGS_MODAL:
    case HIDE_RESET_MODAL:
      return hideModals(state)
    case HIDE_PLAYLIST_MODAL:
      return { ...hideModals(state), playlistId: initialState.playlistId }
    case RESET:
      return { ...initialState, settings: state.settings, seenFeatures: state.seenFeatures }
    case SHOW_ERROR_MESSAGE:
      return { ...state, errorMessage: payload.message }
    case HIDE_ERROR_MESSAGE:
      return { ...state, errorMessage: null }
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
 * @param {{ albums: Album[], artists: Artist[], minDate: string }} payload
 * @returns {State}
 */
function setAlbums(state, payload) {
  const artists = payload.artists.reduce((map, artist) => ({ ...map, [artist.id]: artist }), {})
  const albums = payload.albums.reduce(
    /** @param {typeof state.albums} map */
    (map, album) => {
      if (album.releaseDate < payload.minDate) {
        return map
      }

      const { artistId, ...albumRest } = album
      const matched = map[album.id]

      if (!matched) {
        /** @type {AlbumGrouped} */
        const newAlbum = {
          ...albumRest,
          artists: orderBy(albumRest.artists, 'name').filter((artist) => artist.id !== artistId),
          primaryArtists: [artists[artistId]],
        }

        map[album.id] = newAlbum

        return map
      }

      const inPrimary = matched.primaryArtists.find((artist) => artist.id === artistId)

      if (!inPrimary) {
        matched.artists = matched.artists.filter((artist) => artist.id !== artistId)
        matched.primaryArtists = orderBy([...matched.primaryArtists, artists[artistId]], 'name')
      }

      return map
    },
    {}
  )

  return { ...state, albums }
}

/**
 * @param {State} state
 * @returns {State}
 */
function hideModals(state) {
  return {
    ...state,
    settingsModalVisible: false,
    resetModalVisible: false,
    playlistModalVisible: false,
  }
}

export default rootReducer
