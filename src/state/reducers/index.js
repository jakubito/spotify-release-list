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
} from 'state/actions'
import { setAlbums } from './albums'
import { hideModals, showPlaylistModal, showResetModal, showSettingsModal } from './modals'

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
      return { ...state, syncing: true, syncingProgress: 0 }
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
      return showSettingsModal(state)
    case SHOW_RESET_MODAL:
      return showResetModal(state)
    case SHOW_PLAYLIST_MODAL:
      return showPlaylistModal(state)
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
    default:
      return state
  }
}

export default rootReducer
