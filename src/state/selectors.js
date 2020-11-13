import { createSelector } from 'reselect'
import moment from 'moment'
import Fuse from 'fuse.js'
import intersect from 'fast_array_intersect'
import { buildReleasesEntries, buildReleasesMap, includesTruthy, getReleasesBetween } from 'helpers'

/** @param {State} state */
export const getUser = (state) => state.user

/** @param {State} state */
export const getSyncing = (state) => state.syncing

/** @param {State} state */
export const getSyncingProgress = (state) => state.syncingProgress

/** @param {State} state */
export const getLastSync = (state) => state.lastSync

/** @param {State} state */
export const getPreviousSyncMaxDate = (state) => state.previousSyncMaxDate

/** @param {State} state */
export const getToken = (state) => state.token

/** @param {State} state */
export const getTokenExpires = (state) => state.tokenExpires

/** @param {State} state */
export const getTokenScope = (state) => state.tokenScope

/** @param {State} state */
export const getNonce = (state) => state.nonce

/** @param {State} state */
export const getAlbums = (state) => state.albums

/** @param {State} state */
export const getSettings = (state) => state.settings

/** @param {State} state */
export const getSettingsModalVisible = (state) => state.settingsModalVisible

/** @param {State} state */
export const getResetModalVisible = (state) => state.resetModalVisible

/** @param {State} state */
export const getPlaylistModalVisible = (state) => state.playlistModalVisible

/** @param {State} state */
export const getFiltersVisible = (state) => state.filtersVisible

/** @param {State} state */
export const getErrorMessage = (state) => state.errorMessage

/** @param {State} state */
export const getPlaylistForm = (state) => state.playlistForm

/** @param {State} state */
export const getPlaylistId = (state) => state.playlistId

/** @param {State} state */
export const getCreatingPlaylist = (state) => state.creatingPlaylist

/** @param {State} state */
export const getSeenFeatures = (state) => state.seenFeatures

/** @param {State} state */
export const getFilters = (state) => state.filters

export const getSettingsGroups = createSelector(getSettings, (settings) => settings.groups)
export const getSettingsDays = createSelector(getSettings, (settings) => settings.days)
export const getSettingsMarket = createSelector(getSettings, (settings) => settings.market)
export const getSettingsTheme = createSelector(getSettings, (settings) => settings.theme)
export const getSettingsUriLinks = createSelector(getSettings, (settings) => settings.uriLinks)
export const getSettingsCovers = createSelector(getSettings, (settings) => settings.covers)

export const getFiltersGroups = createSelector(getFilters, (filters) => filters.groups)
export const getFiltersSearch = createSelector(getFilters, (filters) => filters.search)
export const getFiltersStartDate = createSelector(getFilters, (filters) => filters.startDate)
export const getFiltersEndDate = createSelector(getFilters, (filters) => filters.endDate)

export const getWorking = createSelector([getSyncing, getCreatingPlaylist], (...values) =>
  includesTruthy(values)
)

export const getModalVisible = createSelector(
  [getSettingsModalVisible, getResetModalVisible, getPlaylistModalVisible],
  (...values) => includesTruthy(values)
)

export const getFiltersApplied = createSelector(
  [getFiltersSearch, getFiltersStartDate, getFiltersEndDate],
  (...values) => includesTruthy(values)
)

export const getLastSyncDate = createSelector(
  getLastSync,
  (lastSync) => lastSync && new Date(lastSync)
)

const getAlbumsArray = createSelector(getAlbums, (albums) => Object.values(albums))

export const getAllReleasesMap = createSelector(getAlbumsArray, buildReleasesMap)

const getAllReleasesEntries = createSelector(getAllReleasesMap, buildReleasesEntries)

export const getReleasesMinDate = createSelector(getAllReleasesEntries, (entries) =>
  entries.length ? entries[entries.length - 1][0] : null
)

export const getReleasesMaxDate = createSelector(getAllReleasesEntries, (entries) =>
  entries.length ? entries[0][0] : null
)

export const getReleasesMinMaxDates = createSelector(
  [getReleasesMinDate, getReleasesMaxDate],
  (minDate, maxDate) => minDate && maxDate && { minDate: moment(minDate), maxDate: moment(maxDate) }
)

export const getFiltersDates = createSelector(
  [getFiltersStartDate, getFiltersEndDate],
  (startDate, endDate) =>
    startDate && endDate && { startDate: moment(startDate), endDate: moment(endDate) }
)

const getFuseInstance = createSelector(
  getAlbumsArray,
  (albumsArray) =>
    new Fuse(albumsArray, {
      keys: ['name', 'primaryArtists.name'],
      threshold: 0.2,
      ignoreLocation: true,
    })
)

const getSearchAlbums = createSelector(
  [getFiltersSearch, getFuseInstance],
  (searchQuery, fuse) => searchQuery && fuse.search(searchQuery).map((result) => result.item.id)
)

const getDateRangeAlbums = createSelector(
  [getFiltersDates, getAllReleasesMap],
  (dates, releasesMap) => dates && getReleasesBetween(releasesMap, dates.startDate, dates.endDate)
)

const getFilteredAlbumsArray = createSelector(
  [getAlbums, getSearchAlbums, getDateRangeAlbums],
  (albums, ...filtered) => intersect(filtered.filter(Array.isArray)).map((id) => albums[id])
)

const getFilteredReleasesMap = createSelector(getFilteredAlbumsArray, buildReleasesMap)

const getFilteredReleasesEntries = createSelector(getFilteredReleasesMap, buildReleasesEntries)

export const getReleasesEntries = createSelector(
  [getFiltersApplied, getFilteredReleasesEntries, getAllReleasesEntries],
  (filtersApplied, filtered, all) => (filtersApplied ? filtered : all)
)

export const getReleasesCount = createSelector(
  [getFiltersApplied, getFilteredAlbumsArray, getAlbumsArray],
  (filtersApplied, filtered, all) => (filtersApplied ? filtered.length : all.length)
)

export const getHasReleases = createSelector(getReleasesCount, (count) => Boolean(count))
