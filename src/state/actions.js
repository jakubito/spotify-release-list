import { createAction } from '@reduxjs/toolkit'

/** @type {ActionCreatorWithPayload<{ locationSearch: string }, 'authorize'>} */
export const authorize = createAction('authorize')
export const authorizeStart = createAction('authorizeStart')
export const authorizeFinished = createAction('authorizeFinished')
/** @type {ActionCreatorWithOptionalPayload<{ resetAuthData?: boolean }, 'authorizeError'>} */
export const authorizeError = createAction('authorizeError')
/** @type {ActionCreatorWithOptionalPayload<{ auto?: boolean }, 'sync'>} */
export const sync = createAction('sync')
export const syncStart = createAction('syncStart')
/** @type {ActionCreatorWithPayload<{ albums: AlbumsMap, user: User, previousSyncMaxDate: string, auto?: boolean }, 'syncFinished'>} */
export const syncFinished = createAction('syncFinished')
export const syncError = createAction('syncError')
export const syncCancel = createAction('syncCancel')
/** @type {ActionCreatorWithPayload<number, 'setSyncingProgress'>} */
export const setSyncingProgress = createAction('setSyncingProgress')
export const reset = createAction('reset')
/** @type {ActionCreatorWithPayload<Partial<Settings>, 'setSettings'>} */
export const setSettings = createAction('setSettings')
export const showPlaylistModal = createAction('showPlaylistModal')
export const hidePlaylistModal = createAction('hidePlaylistModal')
export const showUpdatePlaylistModal = createAction('showUpdatePlaylistModal')
export const hideUpdatePlaylistModal = createAction('hideUpdatePlaylistModal')
/** @type {ActionCreatorWithPayload<string, 'showMessage'>} */
export const showMessage = createAction('showMessage')
/** @type {ActionCreatorWithOptionalPayload<string, 'showErrorMessage'>} */
export const showErrorMessage = createAction('showErrorMessage')
export const hideMessage = createAction('hideMessage')
export const loadPlaylists = createAction('loadPlaylists')
export const loadPlaylistsStart = createAction('loadPlaylistsStart')
/** @type {ActionCreatorWithPayload<Playlist[], 'loadPlaylistsFinished'>} */
export const loadPlaylistsFinished = createAction('loadPlaylistsFinished')
export const loadPlaylistsError = createAction('loadPlaylistsError')
/** @type {ActionCreatorWithPayload<PlaylistForm, 'setPlaylistForm'>} */
export const setPlaylistForm = createAction('setPlaylistForm')
export const createPlaylist = createAction('createPlaylist')
export const createPlaylistStart = createAction('createPlaylistStart')
/** @type {ActionCreatorWithPayload<Playlist, 'createPlaylistFinished'>} */
export const createPlaylistFinished = createAction('createPlaylistFinished')
export const createPlaylistError = createAction('createPlaylistError')
export const createPlaylistCancel = createAction('createPlaylistCancel')
/** @type {ActionCreatorWithPayload<{ playlist: Playlist, strategy: PlaylistUpdateStrategy }, 'updatePlaylist'>} */
export const updatePlaylist = createAction('updatePlaylist')
export const updatePlaylistStart = createAction('updatePlaylistStart')
/** @type {ActionCreatorWithPayload<Playlist, 'updatePlaylistFinished'>} */
export const updatePlaylistFinished = createAction('updatePlaylistFinished')
export const updatePlaylistError = createAction('updatePlaylistError')
export const updatePlaylistCancel = createAction('updatePlaylistCancel')
/** @type {ActionCreatorWithPayload<string, 'setSelectedPlaylistId'>} */
export const setSelectedPlaylistId = createAction('setSelectedPlaylistId')
export const resetPlaylist = createAction('resetPlaylist')
export const toggleFiltersVisible = createAction('toggleFiltersVisible')
/** @type {ActionCreatorWithPayload<Partial<Filters>, 'setFilters'>} */
export const setFilters = createAction('setFilters')
export const resetFilters = createAction('resetFilters')
export const autoSyncStart = createAction('autoSyncStart')
export const autoSyncStop = createAction('autoSyncStop')
export const updateReady = createAction('updateReady')
export const dismissUpdate = createAction('dismissUpdate')
export const triggerUpdate = createAction('triggerUpdate')
/** @type {ActionCreatorWithPayload<{ id: string, selected: boolean }, 'setFavorite'>} */
export const setFavorite = createAction('setFavorite')
/** @type {ActionCreatorWithPayload<boolean, 'setFavoriteAll'>} */
export const setFavoriteAll = createAction('setFavoriteAll')
export const toggleEditingFavorites = createAction('toggleEditingFavorites')
/** @type {ActionCreatorWithPayload<string, 'setLastSettingsPath'>} */
export const setLastSettingsPath = createAction('setLastSettingsPath')
export const applyLabelBlocklist = createAction('applyLabelBlocklist')
/** @type {ActionCreatorWithPayload<number, 'setLabelBlocklistHeight'>} */
export const setLabelBlocklistHeight = createAction('setLabelBlocklistHeight')
export const syncAnimationFinished = createAction('syncAnimationFinished')
export const downloadAlbumsCsv = createAction('downloadAlbumsCsv')
