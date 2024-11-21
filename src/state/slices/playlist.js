import {
  createPlaylistCancel,
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  hidePlaylistModal,
  hideUpdatePlaylistModal,
  loadPlaylistsError,
  loadPlaylistsFinished,
  loadPlaylistsStart,
  resetPlaylist,
  setPlaylistForm,
  setSelectedPlaylistId,
  showPlaylistModal,
  showUpdatePlaylistModal,
  updatePlaylistCancel,
  updatePlaylistError,
  updatePlaylistFinished,
  updatePlaylistStart,
} from 'state/actions'

/** @type {Pick<State, 'creatingPlaylist' | 'updatingPlaylist' | 'loadingPlaylists' | 'playlists' | 'selectedPlaylistId' | 'lastPlaylistsRefresh' | 'playlistModalVisible' | 'updatePlaylistModalVisible' | 'playlistResult' | 'playlistForm'>} */
export const initialState = {
  loadingPlaylists: false,
  creatingPlaylist: false,
  updatingPlaylist: false,
  playlistModalVisible: false,
  updatePlaylistModalVisible: false,
  playlists: [],
  selectedPlaylistId: null,
  lastPlaylistsRefresh: null,
  playlistResult: null,
  playlistForm: {
    name: null,
    description: null,
    isPrivate: null,
  },
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(showPlaylistModal, (state) => {
      state.playlistModalVisible = true
    })
    .addCase(hidePlaylistModal, (state) => {
      state.playlistModalVisible = false
      state.playlistResult = null
    })
    .addCase(showUpdatePlaylistModal, (state) => {
      state.updatePlaylistModalVisible = true
    })
    .addCase(hideUpdatePlaylistModal, (state) => {
      state.updatePlaylistModalVisible = false
      state.playlistResult = null
    })
    .addCase(loadPlaylistsStart, (state) => {
      state.loadingPlaylists = true
      state.updatePlaylistModalVisible = true
    })
    .addCase(loadPlaylistsFinished, (state, action) => {
      state.loadingPlaylists = false
      state.playlists = action.payload
      state.lastPlaylistsRefresh = new Date().toISOString()

      const selectedPlaylistExists =
        Boolean(state.selectedPlaylistId) &&
        state.playlists.some((playlist) => playlist.id === state.selectedPlaylistId)

      if (!selectedPlaylistExists) {
        state.selectedPlaylistId = action.payload[0]?.id
      }
    })
    .addCase(loadPlaylistsError, (state) => {
      state.loadingPlaylists = false
    })
    .addCase(setPlaylistForm, (state, action) => {
      state.playlistForm = action.payload
    })
    .addCase(createPlaylistStart, (state) => {
      state.creatingPlaylist = true
      state.playlistModalVisible = true
    })
    .addCase(createPlaylistFinished, (state, action) => {
      state.creatingPlaylist = false
      state.playlistResult = action.payload
      state.lastPlaylistsRefresh = null
    })
    .addCase(createPlaylistError, (state) => {
      state.creatingPlaylist = false
    })
    .addCase(createPlaylistCancel, (state) => {
      state.creatingPlaylist = false
    })
    .addCase(updatePlaylistStart, (state) => {
      state.updatingPlaylist = true
      state.updatePlaylistModalVisible = true
    })
    .addCase(updatePlaylistFinished, (state, action) => {
      state.updatingPlaylist = false
      state.playlistResult = action.payload
    })
    .addCase(updatePlaylistError, (state) => {
      state.updatingPlaylist = false
    })
    .addCase(updatePlaylistCancel, (state) => {
      state.updatingPlaylist = false
    })
    .addCase(setSelectedPlaylistId, (state, action) => {
      state.selectedPlaylistId = action.payload
    })
    .addCase(resetPlaylist, (state) => {
      state.playlistResult = null
    })
}
