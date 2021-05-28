import { createSelector } from 'reselect'
import moment from 'moment'
import Fuse from 'fuse.js'
import intersect from 'fast_array_intersect'
import last from 'lodash/last'
import { AlbumGroup } from 'enums'
import { includesTruthy, getReleasesBetween, merge } from 'helpers'
import { buildReleasesEntries, buildReleasesMap } from './helpers'

const VARIOUS_ARTISTS = 'Various Artist'
const VARIOUS_ARTISTS_ID = '0LyfQWJT6nXafLPZqxe9Of'

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
export const getPlaylistModalVisible = (state) => state.playlistModalVisible

/** @param {State} state */
export const getFiltersVisible = (state) => state.filtersVisible

/** @param {State} state */
export const getMessage = (state) => state.message

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
export const getFiltersExcludeVariousArtists = createSelector(
  getFilters,
  (filters) => filters.excludeVariousArtists
)

/**
 * Get all token related data
 */
export const getTokenData = createSelector(
  [getToken, getTokenExpires, getTokenScope],
  (token, tokenExpires, tokenScope) => ({ token, tokenExpires, tokenScope })
)

/**
 * Check if there is any async work being done
 */
export const getWorking = createSelector([getSyncing, getCreatingPlaylist], (...values) =>
  includesTruthy(values)
)

/**
 * Check if any modal is visible
 */
export const getModalVisible = createSelector([getPlaylistModalVisible], (...values) =>
  includesTruthy(values)
)

/**
 * Check if any filter is applied
 */
export const getFiltersApplied = createSelector(
  getFiltersGroups,
  getFiltersSearch,
  getFiltersStartDate,
  getFiltersEndDate,
  getFiltersExcludeVariousArtists,
  (groups, ...rest) => Boolean(groups.length) || includesTruthy(rest)
)

/**
 * Get last sync as Date instance
 */
export const getLastSyncDate = createSelector(
  getLastSync,
  (lastSync) => lastSync && new Date(lastSync)
)

/**
 * Get all albums / releases as an array
 */
const getAlbumsArray = createSelector(getAlbums, (albums) => Object.values(albums))

/**
 * Get all releases as a map with release dates as keys
 */
export const getOriginalReleasesMap = createSelector(getAlbumsArray, buildReleasesMap)

/**
 * Get all releases as `[release date, albums]` entries / tuples
 */
const getOriginalReleasesEntries = createSelector(getOriginalReleasesMap, buildReleasesEntries)

/**
 * Check if there are any releases
 */
export const getHasOriginalReleases = createSelector(getOriginalReleasesEntries, (entries) =>
  Boolean(entries.length)
)

/**
 * Get earliest date in current releases collection
 */
export const getReleasesMinDate = createSelector(getOriginalReleasesEntries, (entries) =>
  entries.length ? last(entries)[0] : null
)

/**
 * Get latest date in current releases collection
 */
export const getReleasesMaxDate = createSelector(getOriginalReleasesEntries, (entries) =>
  entries.length ? entries[0][0] : null
)

/**
 * Get earliest and latest dates as Moment instances
 */
export const getReleasesMinMaxDates = createSelector(
  [getReleasesMinDate, getReleasesMaxDate],
  (minDate, maxDate) => minDate && maxDate && { minDate: moment(minDate), maxDate: moment(maxDate) }
)

/**
 * Get date range filter dates as Moment instances
 */
export const getFiltersDates = createSelector(
  [getFiltersStartDate, getFiltersEndDate],
  (startDate, endDate) =>
    startDate && endDate && { startDate: moment(startDate), endDate: moment(endDate) }
)

/**
 * Get all releases as a map with album groups as keys
 */
export const getReleasesGroupMap = createSelector(getAlbumsArray, (albums) =>
  albums.reduce((map, album) => {
    const albumMap = Object.keys(album.artists).reduce(
      (albumMap, group) => ({ ...albumMap, [group]: [album.id] }),
      /** @type {ReleasesGroupMap} */ ({})
    )

    return merge(map, albumMap)
  }, /** @type {ReleasesGroupMap} */ ({}))
)

/**
 * Get current Fuse.js instance
 */
const getFuseInstance = createSelector(
  getAlbumsArray,
  (albums) =>
    new Fuse(albums, {
      keys: ['name', ...Object.values(AlbumGroup).map((group) => `artists.${group}.name`)],
      threshold: 0.1,
    })
)

/**
 * Get all non-"Various Artists" album IDs
 */
const getNonVariousArtistsAlbumIds = createSelector(getAlbumsArray, (albums) =>
  albums.reduce((ids, album) => {
    const variousArtists = Object.values(album.artists)
      .flat()
      .concat(album.otherArtists)
      .find((artist) => artist.name === VARIOUS_ARTISTS || artist.id === VARIOUS_ARTISTS_ID)

    if (!variousArtists) {
      ids.push(album.id)
    }

    return ids
  }, [])
)

/**
 * Get album IDs based on search filter
 */
const getSearchFiltered = createSelector(
  [getFiltersSearch, getFuseInstance],
  (searchQuery, fuse) => searchQuery && fuse.search(searchQuery).map((result) => result.item.id)
)

/**
 * Get album IDs based on date range filter
 */
const getDateRangeFiltered = createSelector(
  [getFiltersDates, getOriginalReleasesMap],
  (dates, releasesMap) => dates && getReleasesBetween(releasesMap, dates.startDate, dates.endDate)
)

/**
 * Get album IDs based on album groups filter
 */
const getAlbumGroupsFiltered = createSelector(
  [getFiltersGroups, getReleasesGroupMap],
  (groups, groupMap) =>
    groups.length &&
    groups.reduce((ids, group) => [...ids, ...groupMap[group]], /** @type {string[]} */ ([]))
)

/**
 * Get album IDs based on Various Artists filter
 */
const getVariousArtistsFiltered = createSelector(
  [getFiltersExcludeVariousArtists, getNonVariousArtistsAlbumIds],
  (exclude, ids) => exclude && ids
)

/**
 * Intersect all filtered results and return albums as an array
 */
const getFilteredAlbumsArray = createSelector(
  getAlbums,
  getSearchFiltered,
  getDateRangeFiltered,
  getAlbumGroupsFiltered,
  getVariousArtistsFiltered,
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
 * Final releases selector that returns either filtered or original releases
 */
export const getReleasesEntries = createSelector(
  [getFiltersApplied, getFilteredReleasesEntries, getOriginalReleasesEntries],
  (filtersApplied, filtered, original) => (filtersApplied ? filtered : original)
)

/**
 * Get final releases count
 */
export const getReleasesCount = createSelector(
  [getFiltersApplied, getFilteredAlbumsArray, getAlbumsArray],
  (filtersApplied, filtered, original) => (filtersApplied ? filtered.length : original.length)
)

/**
 * Check if there are any releases (original / filtered)
 */
export const getHasReleases = createSelector(getReleasesCount, (count) => Boolean(count))
