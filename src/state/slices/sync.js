import {
  authorizeError,
  authorizeFinished,
  authorizeStart,
  setSyncingProgress,
  syncCancel,
  syncError,
  syncFinished,
  syncStart,
} from 'state/actions'
import { initialState as filtersInitialState } from './filters'

/** @type {Pick<State, 'albums' | 'user' | 'authorizing' | 'syncing' | 'syncingProgress' | 'lastSync' | 'lastAutoSync' | 'previousSyncMaxDate'>} */
export const initialState = {
  albums: {},
  user: null,
  authorizing: false,
  syncing: false,
  syncingProgress: 0,
  lastSync: null,
  lastAutoSync: null,
  previousSyncMaxDate: null,
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
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
        ...filtersInitialState.filters,
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
}
