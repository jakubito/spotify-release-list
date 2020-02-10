export const SYNC = 'SYNC';
export const SYNC_FINISHED = 'SYNC_FINISHED';
export const SYNC_ERROR = 'SYNC_ERROR';
export const SET_SYNCING = 'SET_SYNCING';
export const SET_USER = 'SET_USER';
export const SET_ARTISTS = 'SET_ARTISTS';
export const ADD_ALBUMS = 'ADD_ALBUMS';
export const RESET = 'RESET';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SHOW_SETTINGS_MODAL = 'SHOW_SETTINGS_MODAL';
export const HIDE_SETTINGS_MODAL = 'HIDE_SETTINGS_MODAL';
export const SHOW_RESET_MODAL = 'SHOW_RESET_MODAL';
export const HIDE_RESET_MODAL = 'HIDE_RESET_MODAL';
export const SHOW_PLAYLIST_MODAL = 'SHOW_PLAYLIST_MODAL';
export const HIDE_PLAYLIST_MODAL = 'HIDE_PLAYLIST_MODAL';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_NONCE = 'SET_NONCE';
export const SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE';
export const HIDE_ERROR_MESSAGE = 'HIDE_ERROR_MESSAGE';
export const SET_PLAYLIST_FORM = 'SET_PLAYLIST_FORM';
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const CREATE_PLAYLIST_FINISHED = 'CREATE_PLAYLIST_FINISHED';
export const CREATE_PLAYLIST_ERROR = 'CREATE_PLAYLIST_ERROR';
export const SET_CREATING_PLAYLIST = 'SET_CREATING_PLAYLIST';

export function sync() {
  return {
    type: SYNC,
  };
}

export function syncFinished() {
  return {
    type: SYNC_FINISHED,
  };
}

export function syncError() {
  return {
    type: SYNC_ERROR,
  };
}

export function setSyncing(syncing) {
  return {
    type: SET_SYNCING,
    payload: { syncing },
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    payload: { user },
  };
}

export function setArtists(artists) {
  return {
    type: SET_ARTISTS,
    payload: { artists },
  };
}

export function addAlbums(albums, afterDateString) {
  return {
    type: ADD_ALBUMS,
    payload: { albums, afterDateString },
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function setSettings(settings) {
  return {
    type: SET_SETTINGS,
    payload: { settings },
  };
}

export function showSettingsModal() {
  return {
    type: SHOW_SETTINGS_MODAL,
  };
}

export function hideSettingsModal() {
  return {
    type: HIDE_SETTINGS_MODAL,
  };
}

export function showResetModal() {
  return {
    type: SHOW_RESET_MODAL,
  };
}

export function hideResetModal() {
  return {
    type: HIDE_RESET_MODAL,
  };
}

export function showPlaylistModal() {
  return {
    type: SHOW_PLAYLIST_MODAL,
  };
}

export function hidePlaylistModal() {
  return {
    type: HIDE_PLAYLIST_MODAL,
  };
}

export function setToken(token, tokenExpires, tokenScope) {
  return {
    type: SET_TOKEN,
    payload: { token, tokenExpires, tokenScope },
  };
}

export function setNonce(nonce) {
  return {
    type: SET_NONCE,
    payload: { nonce },
  };
}

export function showErrorMessage(message = 'Oops! Something went wrong.') {
  return {
    type: SHOW_ERROR_MESSAGE,
    payload: { message },
  };
}

export function hideErrorMessage() {
  return {
    type: HIDE_ERROR_MESSAGE,
  };
}

export function setPlaylistForm(startDate, endDate, name, description, isPrivate) {
  return {
    type: SET_PLAYLIST_FORM,
    payload: { startDate, endDate, name, description, isPrivate },
  };
}

export function createPlaylist() {
  return {
    type: CREATE_PLAYLIST,
  };
}

export function createPlaylistFinished(id) {
  return {
    type: CREATE_PLAYLIST_FINISHED,
    payload: { id },
  };
}

export function createPlaylistError() {
  return {
    type: CREATE_PLAYLIST_ERROR,
  };
}

export function setCreatingPlaylist(creatingPlaylist) {
  return {
    type: SET_CREATING_PLAYLIST,
    payload: { creatingPlaylist },
  };
}
