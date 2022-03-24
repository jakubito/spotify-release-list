import { createReducer } from '@reduxjs/toolkit'
import { AlbumGroup, GroupColorSchemes } from 'enums'
import { deleteLabels } from 'helpers'
import {
  addSeenFeature,
  applyLabelBlocklist,
  authorizeError,
  authorizeFinished,
  authorizeStart,
  createPlaylistCancel,
  createPlaylistError,
  createPlaylistFinished,
  createPlaylistStart,
  dismissUpdate,
  hideMessage,
  hidePlaylistModal,
  reset,
  resetFilters,
  resetPlaylist,
  setFavorite,
  setFavoriteAll,
  setFilters,
  setLabelBlocklistHeight,
  setLastSettingsPath,
  setPlaylistForm,
  setSettings,
  setSyncingProgress,
  showErrorMessage,
  showMessage,
  showPlaylistModal,
  syncCancel,
  syncError,
  syncFinished,
  syncStart,
  toggleEditingFavorites,
  toggleFiltersVisible,
  updateReady,
} from 'state/actions'
import { getReleasesArray } from 'state/selectors'

/** @type {State} */
export const INITIAL_STATE = {
  authorizing: false,
  albums: {},
  syncing: false,
  syncingProgress: 0,
  lastSync: null,
  lastAutoSync: null,
  previousSyncMaxDate: null,
  creatingPlaylist: false,
  playlistId: null,
  playlistForm: {
    name: null,
    description: null,
    isPrivate: null,
  },
  user: null,
  message: null,
  playlistModalVisible: false,
  filtersVisible: false,
  settings: {
    groups: Object.values(AlbumGroup),
    groupColors: GroupColorSchemes.DEFAULT,
    days: 30,
    market: '',
    theme: '',
    uriLinks: false,
    covers: true,
    autoSync: false,
    autoSyncTime: '08:00',
    notifications: true,
    firstDayOfWeek: 0,
    displayTracks: false,
    fullAlbumData: false,
    displayLabels: false,
    displayPopularity: false,
    labelBlocklist: '',
  },
  filters: {
    groups: [],
    search: '',
    startDate: null,
    endDate: null,
    excludeVariousArtists: false,
    excludeRemixes: false,
    excludeDuplicates: false,
    favoritesOnly: false,
  },
  seenFeatures: [],
  updateReady: false,
  favorites: {},
  editingFavorites: false,
  lastSettingsPath: null,
  labelBlocklistHeight: null,
}

const rootReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(authorizeStart, (state) => {
      state.authorizing = true
    })
    .addCase(authorizeFinished, (state) => {
      state.authorizing = false
    })
    .addCase(authorizeError, (state) => {
      state.authorizing = false
    })
    .addCase(syncStart, (state) => {
      state.syncing = true
      state.syncingProgress = 0
      state.filtersVisible = false
      state.editingFavorites = false
      state.filters = {
        ...INITIAL_STATE.filters,
        excludeVariousArtists: state.filters.excludeVariousArtists,
        excludeRemixes: state.filters.excludeRemixes,
        excludeDuplicates: state.filters.excludeDuplicates,
      }
    })
    .addCase(syncFinished, (state, action) => {
      state.albums = action.payload.albums
      state.user = action.payload.user
      state.previousSyncMaxDate = action.payload.previousSyncMaxDate
      state[action.payload.auto ? 'lastAutoSync' : 'lastSync'] = new Date().toISOString()
      state.syncing = false
      state.favorites = {}
    })
    .addCase(syncError, (state) => {
      state.syncing = false
    })
    .addCase(syncCancel, (state) => {
      state.syncing = false
    })
    .addCase(setSyncingProgress, (state, action) => {
      state.syncingProgress = action.payload
    })
    .addCase(setSettings, (state, action) => {
      Object.assign(state.settings, action.payload)
    })
    .addCase(showPlaylistModal, (state) => {
      state.playlistModalVisible = true
    })
    .addCase(hidePlaylistModal, (state) => {
      state.playlistModalVisible = false
      state.playlistId = null
    })
    .addCase(showMessage, (state, action) => {
      state.message = { text: action.payload, type: 'normal' }
    })
    .addCase(showErrorMessage, (state, action) => {
      const text = action.payload || 'Oops! Something went wrong.'
      state.message = { text, type: 'error' }
    })
    .addCase(hideMessage, (state) => {
      state.message = null
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
    .addCase(addSeenFeature, (state, action) => {
      state.seenFeatures.push(action.payload)
    })
    .addCase(toggleFiltersVisible, (state) => {
      state.filtersVisible = !state.filtersVisible
    })
    .addCase(setFilters, (state, action) => {
      Object.assign(state.filters, action.payload)
    })
    .addCase(resetFilters, (state) => {
      Object.assign(state.filters, INITIAL_STATE.filters)
    })
    .addCase(updateReady, (state) => {
      state.updateReady = true
    })
    .addCase(dismissUpdate, (state) => {
      state.updateReady = false
    })
    .addCase(setFavorite, (state, action) => {
      state.favorites[action.payload.id] = action.payload.selected
    })
    .addCase(setFavoriteAll, (state, action) => {
      for (const album of getReleasesArray(state)) {
        state.favorites[album.id] = action.payload
      }
    })
    .addCase(toggleEditingFavorites, (state) => {
      state.editingFavorites = !state.editingFavorites
    })
    .addCase(setLastSettingsPath, (state, action) => {
      state.lastSettingsPath = action.payload
    })
    .addCase(reset, (state) => {
      Object.assign(state, INITIAL_STATE)
    })
    .addCase(applyLabelBlocklist, (state) => {
      const deletedIds = deleteLabels(state.albums, state.settings.labelBlocklist)
      for (const id of deletedIds) delete state.favorites[id]
    })
    .addCase(setLabelBlocklistHeight, (state, action) => {
      state.labelBlocklistHeight = action.payload
    })
})

export default rootReducer
