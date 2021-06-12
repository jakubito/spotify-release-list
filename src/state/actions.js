export const HYDRATE = 'persist/REHYDRATE'
export const AUTHORIZE = 'AUTHORIZE'
export const AUTHORIZE_START = 'AUTHORIZE_START'
export const AUTHORIZE_FINISHED = 'AUTHORIZE_FINISH'
export const AUTHORIZE_ERROR = 'AUTHORIZE_ERROR'
export const SET_AUTH_DATA = 'SET_AUTH_DATA'
export const SYNC = 'SYNC'
export const SYNC_START = 'SYNC_START'
export const SYNC_FINISHED = 'SYNC_FINISHED'
export const SYNC_ERROR = 'SYNC_ERROR'
export const SYNC_CANCEL = 'SYNC_CANCEL'
export const SET_SYNCING_PROGRESS = 'SET_SYNCING_PROGRESS'
export const SET_USER = 'SET_USER'
export const SET_ALBUMS = 'SET_ALBUMS'
export const RESET = 'RESET'
export const SET_SETTINGS = 'SET_SETTINGS'
export const SHOW_PLAYLIST_MODAL = 'SHOW_PLAYLIST_MODAL'
export const HIDE_PLAYLIST_MODAL = 'HIDE_PLAYLIST_MODAL'
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
export const AUTO_SYNC_START = 'AUTO_SYNC_START'
export const AUTO_SYNC_STOP = 'AUTO_SYNC_STOP'

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

/** @param {string} locationSearch */
export function authorize(locationSearch) {
  return action(AUTHORIZE, { locationSearch })
}

export function authorizeStart() {
  return action(AUTHORIZE_START)
}

export function authorizeFinished() {
  return action(AUTHORIZE_FINISHED)
}

export function authorizeError() {
  return action(AUTHORIZE_ERROR)
}

/** @param {Partial<AuthData>} authData */
export function setAuthData(authData) {
  return action(SET_AUTH_DATA, { authData })
}

/** @param {boolean} [auto] */
export function sync(auto = false) {
  return action(SYNC, { auto })
}

export function syncStart() {
  return action(SYNC_START)
}

/**
 * @param {string} previousSyncMaxDate
 * @param {boolean} [auto]
 */
export function syncFinished(previousSyncMaxDate, auto = false) {
  return action(SYNC_FINISHED, { previousSyncMaxDate, auto })
}

export function syncError() {
  return action(SYNC_ERROR)
}

export function syncCancel() {
  return action(SYNC_CANCEL)
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

export function autoSyncStart() {
  return action(AUTO_SYNC_START)
}

export function autoSyncStop() {
  return action(AUTO_SYNC_STOP)
}
