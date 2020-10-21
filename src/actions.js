export const SYNC = 'SYNC'
export const SYNC_START = 'SYNC_START'
export const SYNC_FINISHED = 'SYNC_FINISHED'
export const SYNC_ERROR = 'SYNC_ERROR'
export const SYNC_CANCEL = 'SYNC_CANCEL'
export const SET_SYNCING = 'SET_SYNCING'
export const SET_SYNCING_PROGRESS = 'SET_SYNCING_PROGRESS'
export const SET_USER = 'SET_USER'
export const SET_ALBUMS = 'SET_ALBUMS'
export const RESET = 'RESET'
export const SET_SETTINGS = 'SET_SETTINGS'
export const SHOW_SETTINGS_MODAL = 'SHOW_SETTINGS_MODAL'
export const HIDE_SETTINGS_MODAL = 'HIDE_SETTINGS_MODAL'
export const SHOW_RESET_MODAL = 'SHOW_RESET_MODAL'
export const HIDE_RESET_MODAL = 'HIDE_RESET_MODAL'
export const SHOW_PLAYLIST_MODAL = 'SHOW_PLAYLIST_MODAL'
export const HIDE_PLAYLIST_MODAL = 'HIDE_PLAYLIST_MODAL'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_NONCE = 'SET_NONCE'
export const SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE'
export const HIDE_ERROR_MESSAGE = 'HIDE_ERROR_MESSAGE'
export const SET_PLAYLIST_FORM = 'SET_PLAYLIST_FORM'
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST'
export const CREATE_PLAYLIST_START = 'CREATE_PLAYLIST_START'
export const CREATE_PLAYLIST_FINISHED = 'CREATE_PLAYLIST_FINISHED'
export const CREATE_PLAYLIST_ERROR = 'CREATE_PLAYLIST_ERROR'
export const CREATE_PLAYLIST_CANCEL = 'CREATE_PLAYLIST_CANCEL'
export const RESET_PLAYLIST = 'RESET_PLAYLIST'
export const ADD_SEEN_FEATURE = 'ADD_SEEN_FEATURE'

function action(type, payload) {
  return { type, payload }
}

export function sync() {
  return action(SYNC)
}

export function syncStart() {
  return action(SYNC_START)
}

export function syncFinished(previousSyncMaxDate) {
  return action(SYNC_FINISHED, { previousSyncMaxDate })
}

export function syncError() {
  return action(SYNC_ERROR)
}

export function syncCancel() {
  return action(SYNC_CANCEL)
}

export function setSyncing(syncing) {
  return action(SET_SYNCING, { syncing })
}

export function setSyncingProgress(syncingProgress) {
  return action(SET_SYNCING_PROGRESS, { syncingProgress })
}

export function setUser(user) {
  return action(SET_USER, { user })
}

export function setAlbums(albums, artists, minDate) {
  return action(SET_ALBUMS, { albums, artists, minDate })
}

export function reset() {
  return action(RESET)
}

export function setSettings(settings) {
  return action(SET_SETTINGS, { settings })
}

export function showSettingsModal() {
  return action(SHOW_SETTINGS_MODAL)
}

export function hideSettingsModal() {
  return action(HIDE_SETTINGS_MODAL)
}

export function showResetModal() {
  return action(SHOW_RESET_MODAL)
}

export function hideResetModal() {
  return action(HIDE_RESET_MODAL)
}

export function showPlaylistModal() {
  return action(SHOW_PLAYLIST_MODAL)
}

export function hidePlaylistModal() {
  return action(HIDE_PLAYLIST_MODAL)
}

export function setToken(token, tokenExpires, tokenScope) {
  return action(SET_TOKEN, { token, tokenExpires, tokenScope })
}

export function setNonce(nonce) {
  return action(SET_NONCE, { nonce })
}

export function showErrorMessage(message = 'Oops! Something went wrong.') {
  return action(SHOW_ERROR_MESSAGE, { message })
}

export function hideErrorMessage() {
  return action(HIDE_ERROR_MESSAGE)
}

export function setPlaylistForm(albumIds, name, description, isPrivate) {
  return action(SET_PLAYLIST_FORM, { albumIds, name, description, isPrivate })
}

export function createPlaylist() {
  return action(CREATE_PLAYLIST)
}

export function createPlaylistStart() {
  return action(CREATE_PLAYLIST_START)
}

export function createPlaylistFinished(id) {
  return action(CREATE_PLAYLIST_FINISHED, { id })
}

export function createPlaylistError() {
  return action(CREATE_PLAYLIST_ERROR)
}

export function createPlaylistCancel() {
  return action(CREATE_PLAYLIST_CANCEL)
}

export function resetPlaylist() {
  return action(RESET_PLAYLIST)
}

export function addSeenFeature(feature) {
  return action(ADD_SEEN_FEATURE, { feature })
}
