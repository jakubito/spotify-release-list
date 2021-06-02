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
export const SHOW_PLAYLIST_MODAL = 'SHOW_PLAYLIST_MODAL'
export const HIDE_PLAYLIST_MODAL = 'HIDE_PLAYLIST_MODAL'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_NONCE = 'SET_NONCE'
export const SHOW_MESSAGE = 'SHOW_MESSAGE'
export const HIDE_MESSAGE = 'HIDE_MESSAGE'
export const SET_PLAYLIST_FORM = 'SET_PLAYLIST_FORM'
export const CREATE_PLAYLIST = 'CREATE_PLAYLIST'
export const CREATE_PLAYLIST_START = 'CREATE_PLAYLIST_START'
export const CREATE_PLAYLIST_FINISHED = 'CREATE_PLAYLIST_FINISHED'
export const CREATE_PLAYLIST_ERROR = 'CREATE_PLAYLIST_ERROR'
export const CREATE_PLAYLIST_CANCEL = 'CREATE_PLAYLIST_CANCEL'
export const RESET_PLAYLIST = 'RESET_PLAYLIST'
export const ADD_SEEN_FEATURE = 'ADD_SEEN_FEATURE'
export const TOGGLE_FILTERS_VISIBLE = 'TOGGLE_FILTERS_VISIBLE'
export const SET_FILTERS = 'SET_FILTERS'
export const RESET_FILTERS = 'RESET_FILTERS'

/**
 * Create action object
 *
 * @template {string} T
 * @template {any} P
 * @param {T} type
 * @param {P} [payload]
 * @returns {{ type: T, payload: P }}
 */
function action(type, payload) {
  return { type, payload }
}

export function sync() {
  return action(SYNC)
}

export function syncStart() {
  return action(SYNC_START)
}

/** @param {string} previousSyncMaxDate */
export function syncFinished(previousSyncMaxDate) {
  return action(SYNC_FINISHED, { previousSyncMaxDate })
}

export function syncError() {
  return action(SYNC_ERROR)
}

export function syncCancel() {
  return action(SYNC_CANCEL)
}

/** @param {boolean} syncing */
export function setSyncing(syncing) {
  return action(SET_SYNCING, { syncing })
}

/** @param {boolean} syncingProgress */
export function setSyncingProgress(syncingProgress) {
  return action(SET_SYNCING_PROGRESS, { syncingProgress })
}

/** @param {User} user */
export function setUser(user) {
  return action(SET_USER, { user })
}

/**
 * @param {AlbumRaw[]} albumsRaw
 * @param {Artist[]} artists
 * @param {string} minDate
 */
export function setAlbums(albumsRaw, artists, minDate) {
  return action(SET_ALBUMS, { albumsRaw, artists, minDate })
}

export function reset() {
  return action(RESET)
}

/** @param {Partial<Settings>} settings */
export function setSettings(settings) {
  return action(SET_SETTINGS, { settings })
}

export function showPlaylistModal() {
  return action(SHOW_PLAYLIST_MODAL)
}

export function hidePlaylistModal() {
  return action(HIDE_PLAYLIST_MODAL)
}

/**
 * @param {string} token
 * @param {string} tokenExpires
 * @param {string} tokenScope
 */
export function setToken(token, tokenExpires, tokenScope) {
  return action(SET_TOKEN, { token, tokenExpires, tokenScope })
}

/** @param {string} nonce */
export function setNonce(nonce) {
  return action(SET_NONCE, { nonce })
}

/**
 * @param {string} text
 * @param {'normal' | 'error'} [type]
 */
export function showMessage(text, type = 'normal') {
  return action(SHOW_MESSAGE, { text, type })
}

/** @param {string} [text] */
export function showErrorMessage(text = 'Oops! Something went wrong.') {
  return showMessage(text, 'error')
}

export function hideMessage() {
  return action(HIDE_MESSAGE)
}

/**
 * @param {string} name
 * @param {string} description
 * @param {boolean} isPrivate
 */
export function setPlaylistForm(name, description, isPrivate) {
  return action(SET_PLAYLIST_FORM, { name, description, isPrivate })
}

export function createPlaylist() {
  return action(CREATE_PLAYLIST)
}

export function createPlaylistStart() {
  return action(CREATE_PLAYLIST_START)
}

/** @param {string} id */
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

/** @param {string} feature */
export function addSeenFeature(feature) {
  return action(ADD_SEEN_FEATURE, { feature })
}

export function toggleFiltersVisible() {
  return action(TOGGLE_FILTERS_VISIBLE)
}

/** @param {Partial<Filters>} filters */
export function setFilters(filters) {
  return action(SET_FILTERS, { filters })
}

export function resetFilters() {
  return action(RESET_FILTERS)
}
