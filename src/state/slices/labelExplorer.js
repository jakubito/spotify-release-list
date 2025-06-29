import {
  searchLabelStart,
  searchLabelFinished,
  searchLabelError,
  clearLabelSearch,
  setLabelFilters,
  resetLabelFilters,
  setSelectedLabelReleases,
  toggleLabelRelease,
  toggleAllLabelReleases,
  showLabelPlaylistModal,
  hideLabelPlaylistModal,
  setLabelPlaylistForm,
  createLabelPlaylistStart,
  createLabelPlaylistFinished,
  createLabelPlaylistError,
  createLabelPlaylistCancel,
  addFavoriteLabel,
  removeFavoriteLabel,
} from 'state/actions'

/** @type {Pick<State, 'labelSearchResults' | 'labelSearching' | 'labelFilters' | 'labelSelectedReleases' | 'labelPlaylistModalVisible' | 'labelPlaylistForm' | 'labelPlaylistResult' | 'creatingLabelPlaylist' | 'favoriteLabels'>} */
export const initialState = {
  labelSearchResults: null,
  labelSearching: false,
  labelFilters: {
    year: null,
    sortBy: 'newest',
  },
  labelSelectedReleases: [],
  labelPlaylistModalVisible: false,
  labelPlaylistForm: {
    name: null,
    description: null,
    isPublic: null,
  },
  labelPlaylistResult: null,
  creatingLabelPlaylist: false,
  favoriteLabels: [],
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(searchLabelStart, (state) => {
      state.labelSearching = true
      state.labelSelectedReleases = []
    })
    .addCase(searchLabelFinished, (state, action) => {
      state.labelSearching = false
      state.labelSearchResults = action.payload
    })
    .addCase(searchLabelError, (state) => {
      state.labelSearching = false
      state.labelSearchResults = null
    })
    .addCase(clearLabelSearch, (state) => {
      state.labelSearchResults = null
      state.labelSelectedReleases = []
      state.labelFilters = initialState.labelFilters
    })
    .addCase(setLabelFilters, (state, action) => {
      Object.assign(state.labelFilters, action.payload)
    })
    .addCase(resetLabelFilters, (state) => {
      state.labelFilters = { ...initialState.labelFilters }
    })
    .addCase(setSelectedLabelReleases, (state, action) => {
      state.labelSelectedReleases = action.payload
    })
    .addCase(toggleLabelRelease, (state, action) => {
      const release = action.payload
      const index = state.labelSelectedReleases.findIndex(r => r.id === release.id)
      
      if (index >= 0) {
        state.labelSelectedReleases.splice(index, 1)
      } else {
        state.labelSelectedReleases.push(release)
      }
    })
    .addCase(toggleAllLabelReleases, (state) => {
      if (!state.labelSearchResults) return
      
      const allSelected = state.labelSelectedReleases.length === state.labelSearchResults.length
      state.labelSelectedReleases = allSelected ? [] : [...state.labelSearchResults]
    })
    .addCase(showLabelPlaylistModal, (state) => {
      state.labelPlaylistModalVisible = true
    })
    .addCase(hideLabelPlaylistModal, (state) => {
      state.labelPlaylistModalVisible = false
      state.labelPlaylistResult = null
    })
    .addCase(setLabelPlaylistForm, (state, action) => {
      state.labelPlaylistForm = action.payload
    })
    .addCase(createLabelPlaylistStart, (state) => {
      state.creatingLabelPlaylist = true
    })
    .addCase(createLabelPlaylistFinished, (state, action) => {
      state.creatingLabelPlaylist = false
      state.labelPlaylistResult = action.payload
    })
    .addCase(createLabelPlaylistError, (state) => {
      state.creatingLabelPlaylist = false
    })
    .addCase(createLabelPlaylistCancel, (state) => {
      state.creatingLabelPlaylist = false
    })
    .addCase(addFavoriteLabel, (state, action) => {
      if (!state.favoriteLabels.includes(action.payload)) {
        state.favoriteLabels.push(action.payload)
      }
    })
    .addCase(removeFavoriteLabel, (state, action) => {
      const index = state.favoriteLabels.indexOf(action.payload)
      if (index >= 0) {
        state.favoriteLabels.splice(index, 1)
      }
    })
}