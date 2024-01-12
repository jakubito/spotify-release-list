import {
  createPlaylistCancel,
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  hidePlaylistModal,
  resetPlaylist,
  setPlaylistForm,
  showPlaylistModal,
} from 'state/actions'

/** @type {Pick<State, 'creatingPlaylist' | 'playlistModalVisible' | 'playlistId' | 'playlistForm'>} */
export const initialState = {
  creatingPlaylist: false,
  playlistModalVisible: false,
  playlistId: null,
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
      state.playlistId = null
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
      state.playlistId = action.payload.id
    })
    .addCase(createPlaylistError, (state) => {
      state.creatingPlaylist = false
    })
    .addCase(createPlaylistCancel, (state) => {
      state.creatingPlaylist = false
    })
    .addCase(resetPlaylist, (state) => {
      state.playlistId = null
    })
}
