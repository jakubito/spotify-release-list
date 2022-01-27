import { createAction } from '@reduxjs/toolkit'

/** @type {ActionCreatorWithPayload<{ locationSearch: string }>} */
export const authorize = createAction('authorize')
export const authorizeStart = createAction('authorizeStart')
export const authorizeFinished = createAction('authorizeFinished')
/** @type {ActionCreatorWithOptionalPayload<{ resetAuthData?: boolean }>} */
export const authorizeError = createAction('authorizeError')
/** @type {ActionCreatorWithOptionalPayload<{ auto?: boolean }>} */
export const sync = createAction('sync')
export const syncStart = createAction('syncStart')
/** @type {ActionCreatorWithPayload<{ previousSyncMaxDate: string, auto?: boolean }>} */
export const syncFinished = createAction('syncFinished')
export const syncError = createAction('syncError')
export const syncCancel = createAction('syncCancel')
/** @type {ActionCreatorWithPayload<number>} */
export const setSyncingProgress = createAction('setSyncingProgress')
/** @type {ActionCreatorWithPayload<User>} */
export const setUser = createAction('setUser')
/** @type {ActionCreatorWithPayload<{ albumsRaw: AlbumRaw[], artists: Artist[], minDate: string }>} */
export const saveAlbums = createAction('saveAlbums')
export const reset = createAction('reset')
/** @type {ActionCreatorWithPayload<Partial<Settings>>} */
export const setSettings = createAction('setSettings')
export const showPlaylistModal = createAction('showPlaylistModal')
export const hidePlaylistModal = createAction('hidePlaylistModal')
/** @type {ActionCreatorWithPayload<string>} */
export const showMessage = createAction('showMessage')
/** @type {ActionCreatorWithOptionalPayload<string>} */
export const showErrorMessage = createAction('showErrorMessage')
export const hideMessage = createAction('hideMessage')
/** @type {ActionCreatorWithPayload<PlaylistForm>} */
export const setPlaylistForm = createAction('setPlaylistForm')
export const createPlaylist = createAction('createPlaylist')
export const createPlaylistStart = createAction('createPlaylistStart')
/** @type {ActionCreatorWithPayload<{ id: string }>} */
export const createPlaylistFinished = createAction('createPlaylistFinished')
export const createPlaylistError = createAction('createPlaylistError')
export const createPlaylistCancel = createAction('createPlaylistCancel')
export const resetPlaylist = createAction('resetPlaylist')
/** @type {ActionCreatorWithPayload<string>} */
export const addSeenFeature = createAction('addSeenFeature')
export const toggleFiltersVisible = createAction('toggleFiltersVisible')
/** @type {ActionCreatorWithPayload<Partial<Filters>>} */
export const setFilters = createAction('setFilters')
export const resetFilters = createAction('resetFilters')
export const autoSyncStart = createAction('autoSyncStart')
export const autoSyncStop = createAction('autoSyncStop')
export const updateReady = createAction('updateReady')
export const dismissUpdate = createAction('dismissUpdate')
export const triggerUpdate = createAction('triggerUpdate')
/** @type {ActionCreatorWithPayload<{ id: string, selected: boolean }>} */
export const setFavorite = createAction('setFavorite')
/** @type {ActionCreatorWithPayload<boolean>} */
export const setFavoriteAll = createAction('setFavoriteAll')
export const toggleEditingFavorites = createAction('toggleEditingFavorites')
/** @type {ActionCreatorWithPayload<string>} */
export const setLastSettingsPath = createAction('setLastSettingsPath')
