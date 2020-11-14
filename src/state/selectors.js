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

// Specific settings selectors
export const getSettingsGroups = createSelector(getSettings, (settings) => settings.groups)
export const getSettingsDays = createSelector(getSettings, (settings) => settings.days)
export const getSettingsMarket = createSelector(getSettings, (settings) => settings.market)
export const getSettingsTheme = createSelector(getSettings, (settings) => settings.theme)
export const getSettingsUriLinks = createSelector(getSettings, (settings) => settings.uriLinks)
export const getSettingsCovers = createSelector(getSettings, (settings) => settings.covers)

// Specific filters selectors
export const getFiltersGroups = createSelector(getFilters, (filters) => filters.groups)
export const getFiltersSearch = createSelector(getFilters, (filters) => filters.search)
export const getFiltersStartDate = createSelector(getFilters, (filters) => filters.startDate)
export const getFiltersEndDate = createSelector(getFilters, (filters) => filters.endDate)

/**
 * Check if there is any async work being done
 */
export const getWorking = createSelector([getSyncing, getCreatingPlaylist], (...values) =>
  includesTruthy(values)
)

/**
 * Check if any modal is visible
 */
export const getModalVisible = createSelector(
  [getSettingsModalVisible, getResetModalVisible, getPlaylistModalVisible],
  (...values) => includesTruthy(values)
)

/**
 * Check if any filter is applied
 */
export const getFiltersApplied = createSelector(
  [getFiltersGroups, getFiltersSearch, getFiltersStartDate, getFiltersEndDate],
  (groups, ...values) => Boolean(groups.length) || includesTruthy(values)
)

/**
 * Get last sync as `Date` instance
 */
export const getLastSyncDate = createSelector(
  getLastSync,
  (lastSync) => lastSync && new Date(lastSync)
)

/**
 * Get all albums / releases as an array
 */
const getAllAlbumsArray = createSelector(getAlbums, (albums) => Object.values(albums))

/**
 * Get all releases as a map with release dates as keys
 */
export const getAllReleasesMap = createSelector(getAllAlbumsArray, buildReleasesMap)

/**
 * Get all releases as `[release date, albums]` entries / tuples
 */
const getAllReleasesEntries = createSelector(getAllReleasesMap, buildReleasesEntries)

/**
 * Get earliest date in current releases collection
 */
export const getReleasesMinDate = createSelector(getAllReleasesEntries, (entries) =>
  entries.length ? entries[entries.length - 1][0] : null
)

/**
 * Get latest date in current releases collection
 */
export const getReleasesMaxDate = createSelector(getAllReleasesEntries, (entries) =>
  entries.length ? entries[0][0] : null
)

/**
 * Get earliest and latest dates as `Date` instances
 */
export const getReleasesMinMaxDates = createSelector(
  [getReleasesMinDate, getReleasesMaxDate],
  (minDate, maxDate) => minDate && maxDate && { minDate: moment(minDate), maxDate: moment(maxDate) }
)

/**
 * Get date range filter dates as `Date` instances
 */
export const getFiltersDates = createSelector(
  [getFiltersStartDate, getFiltersEndDate],
  (startDate, endDate) =>
    startDate && endDate && { startDate: moment(startDate), endDate: moment(endDate) }
)

/**
 * Get all releases as a map with album groups as keys
 */
export const getReleasesGroupMap = createSelector(getAllAlbumsArray, (albums) =>
  albums.reduce(
    (map, album) => ({
      ...map,
      [album.albumGroup]: [...(map[album.albumGroup] || []), album.id],
    }),
    {}
  )
)

/**
 * Get current Fuse.js instance
 */
const getFuseInstance = createSelector(
  getAllAlbumsArray,
  (albums) =>
    new Fuse(albums, {
      keys: ['name', 'primaryArtists.name'],
      threshold: 0.2,
      ignoreLocation: true,
    })
)

/**
 * Get album IDs filtered by text search
 */
const getSearchAlbums = createSelector(
  [getFiltersSearch, getFuseInstance],
  (searchQuery, fuse) => searchQuery && fuse.search(searchQuery).map((result) => result.item.id)
)

/**
 * Get album IDs filtered by date range
 */
const getDateRangeAlbums = createSelector(
  [getFiltersDates, getAllReleasesMap],
  (dates, releasesMap) => dates && getReleasesBetween(releasesMap, dates.startDate, dates.endDate)
)

/**
 * Get album IDs filtered by album groups
 */
const getAlbumGroupsAlbums = createSelector(
  [getFiltersGroups, getReleasesGroupMap],
  (groups, groupMap) =>
    groups.length && groups.reduce((ids, group) => [...ids, ...groupMap[group]], [])
)

/**
 * Intersect all filtered results and return albums as an array
 */
const getFilteredAlbumsArray = createSelector(
  [getAlbums, getSearchAlbums, getDateRangeAlbums, getAlbumGroupsAlbums],
  (albums, ...filtered) => intersect(filtered.filter(Array.isArray)).map((id) => albums[id])
)

/**
 * Get filtered releases as a map with release dates as keys
 */
const getFilteredReleasesMap = createSelector(getFilteredAlbumsArray, buildReleasesMap)

/**
 * Get filtered releases as `[release date, albums]` entries / tuples
 */
const getFilteredReleasesEntries = createSelector(getFilteredReleasesMap, buildReleasesEntries)

/**
 * Final releases selector that returns either filtered or all releases
 */
export const getReleasesEntries = createSelector(
  [getFiltersApplied, getFilteredReleasesEntries, getAllReleasesEntries],
  (filtersApplied, filtered, all) => (filtersApplied ? filtered : all)
)

/**
 * Get final releases count
 */
export const getReleasesCount = createSelector(
  [getFiltersApplied, getFilteredAlbumsArray, getAllAlbumsArray],
  (filtersApplied, filtered, all) => (filtersApplied ? filtered.length : all.length)
)

/**
 * Check if there are any releases
 */
export const getHasReleases = createSelector(getReleasesCount, (count) => Boolean(count))
