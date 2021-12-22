import { createSelector } from 'reselect'
import moment from 'moment'
import Fuse from 'fuse.js'
import intersect from 'fast_array_intersect'
import last from 'lodash/last'
import isEqual from 'lodash/isEqual'
import escapeRegExp from 'lodash/escapeRegExp'
import { AlbumGroup } from 'enums'
import { includesTruthy, getReleasesBetween, merge } from 'helpers'
import { buildReleases, buildReleasesMap } from './helpers'
import { INITIAL_STATE } from './reducer'

const VARIOUS_ARTISTS = 'Various Artist'
const REMIX = 'remix'
const VARIOUS_ARTISTS_ID = '0LyfQWJT6nXafLPZqxe9Of'

/** @param {State} state */
export const getAuthorizing = (state) => state.authorizing

/** @param {State} state */
export const getUser = (state) => state.user

/** @param {State} state */
export const getSyncing = (state) => state.syncing

/** @param {State} state */
export const getSyncingProgress = (state) => state.syncingProgress

/** @param {State} state */
export const getLastSync = (state) => state.lastSync

/** @param {State} state */
export const getLastAutoSync = (state) => state.lastAutoSync

/** @param {State} state */
export const getPreviousSyncMaxDate = (state) => state.previousSyncMaxDate

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

/** @param {State} state */
export const getUpdateReady = (state) => state.updateReady

/** @param {State} state */
export const getFavorites = (state) => state.favorites

/** @param {State} state */
export const getEditingFavorites = (state) => state.editingFavorites

// Individual settings selectors
export const getSettingsGroups = createSelector(getSettings, (settings) => settings.groups)
export const getSettingsGroupColors = createSelector(
  getSettings,
  (settings) => settings.groupColors
)
export const getSettingsDays = createSelector(getSettings, (settings) => settings.days)
export const getSettingsMarket = createSelector(getSettings, (settings) => settings.market)
export const getSettingsTheme = createSelector(getSettings, (settings) => settings.theme)
export const getSettingsUriLinks = createSelector(getSettings, (settings) => settings.uriLinks)
export const getSettingsCovers = createSelector(getSettings, (settings) => settings.covers)

// Individual filters selectors
export const getFiltersGroups = createSelector(getFilters, (filters) => filters.groups)
export const getFiltersSearch = createSelector(getFilters, (filters) => filters.search)
export const getFiltersStartDate = createSelector(getFilters, (filters) => filters.startDate)
export const getFiltersEndDate = createSelector(getFilters, (filters) => filters.endDate)
export const getFiltersExcludeVariousArtists = createSelector(
  getFilters,
  (filters) => filters.excludeVariousArtists
)
export const getFiltersExcludeRemixes = createSelector(
  getFilters,
  (filters) => filters.excludeRemixes
)
export const getFiltersExcludeDuplicates = createSelector(
  getFilters,
  (filters) => filters.excludeDuplicates
)
export const getFiltersFavoritesOnly = createSelector(
  getFilters,
  (filters) => filters.favoritesOnly
)

/**
 * Get relevant app data.
 *
 * @param {State} state
 */
const getAppData = createSelector(getLastSync, getSettings, (...values) => values)

/**
 * Check if any relevant app data exist. This is used to determine visibility
 * of the "Delete app data" button.
 *
 * @param {State} state
 */
export const getHasAppData = createSelector(
  getAppData,
  (appData) => !isEqual(appData, getAppData(INITIAL_STATE))
)

/**
 * Check if there is any async work being done
 */
export const getWorking = createSelector(
  [getSyncing, getCreatingPlaylist, getAuthorizing],
  (...values) => includesTruthy(values)
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
  getFiltersExcludeRemixes,
  getFiltersExcludeDuplicates,
  getFiltersFavoritesOnly,
  (groups, ...rest) => Boolean(groups.length) || includesTruthy(rest)
)

/**
 * Get last sync as Date instance
 */
export const getLastSyncDate = createSelector(
  [getLastSync, getLastAutoSync],
  (lastSync, lastAutoSync) => {
    if (lastSync || lastAutoSync) {
      const newer = (lastSync || '') > (lastAutoSync || '') ? lastSync : lastAutoSync
      return new Date(newer)
    }

    return null
  }
)

/**
 * Get all albums / releases as an array
 */
export const getAlbumsArray = createSelector(getAlbums, (albums) => Object.values(albums))

/**
 * Get all releases as a map with release dates as keys
 */
export const getOriginalReleasesMap = createSelector(getAlbumsArray, buildReleasesMap)

/**
 * Get all releases as ordered array of { date, albums } objects
 */
const getOriginalReleases = createSelector(getOriginalReleasesMap, buildReleases)

/**
 * Check if there are any releases
 */
export const getHasOriginalReleases = createSelector(getOriginalReleases, (releases) =>
  Boolean(releases.length)
)

/**
 * Get earliest date in current releases collection
 */
export const getReleasesMinDate = createSelector(getOriginalReleases, (releases) =>
  releases.length ? last(releases).date : null
)

/**
 * Get latest date in current releases collection
 */
export const getReleasesMaxDate = createSelector(getOriginalReleases, (releases) =>
  releases.length ? releases[0].date : null
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
    const albumMap = Object.keys(album.artists).reduce((albumMap, group) => {
      albumMap[group] = [album.id]
      return albumMap
    }, /** @type {ReleasesGroupMap} */ ({}))

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
      .some((artist) => artist.name === VARIOUS_ARTISTS || artist.id === VARIOUS_ARTISTS_ID)

    if (!variousArtists) {
      ids.push(album.id)
    }

    return ids
  }, /** @type {string[]} */ ([]))
)

/**
 * Get all non-"Remix" album IDs
 */
const getNonRemixAlbumIds = createSelector(getAlbumsArray, (albums) =>
  albums.reduce((ids, album) => {
    console.log(album.name)
    const { name } = album

    if (!name.toLocaleLowerCase().includes(REMIX)) {
      ids.push(album.id)
    }

    return ids
  }, /** @type {string[]} */ ([]))
)

/**
 * Get album IDs with duplicates removed
 */
const getNoDuplicatesAlbumIds = createSelector(getOriginalReleases, (releases) => {
  const charsMap = { '[': '(', ']': ')', '’': "'" }
  const escapedChars = escapeRegExp(Object.keys(charsMap).join(''))
  const charsRegex = new RegExp(`[${escapedChars}]`, 'g')

  return releases.reduce((ids, { albums }) => {
    /** @type {Record<string, string>} */
    const namesMap = {}

    for (const album of albums) {
      const unifiedName = album.name.replace(charsRegex, (key) => charsMap[key]).toLowerCase()
      if (unifiedName in namesMap) continue
      namesMap[unifiedName] = album.id
    }

    return ids.concat(Object.values(namesMap))
  }, /** @type {string[]} */ ([]))
})

/**
 * Get favorite album ids
 */
const getFavoriteAlbumIds = createSelector(getFavorites, (favorites) =>
  Object.entries(favorites).reduce((ids, [id, selected]) => {
    if (selected) ids.push(id)
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
    groups.reduce((ids, group) => ids.concat(groupMap[group]), /** @type {string[]} */ ([]))
)

/**
 * Get album IDs based on Various Artists filter
 */
const getVariousArtistsFiltered = createSelector(
  [getFiltersExcludeVariousArtists, getNonVariousArtistsAlbumIds],
  (exclude, ids) => exclude && ids
)

/**
 * Get album IDs based on remix filter
 */
const getRemixFiltered = createSelector(
  [getFiltersExcludeRemixes, getNonRemixAlbumIds],
  (exclude, ids) => exclude && ids
)

/**
 * Get albums IDs based on duplicates filter
 */
const getDuplicatesFiltered = createSelector(
  [getFiltersExcludeDuplicates, getNoDuplicatesAlbumIds],
  (exclude, ids) => exclude && ids
)

/**
 * Get favorite album ids based on favorites filter
 */
const getFavoritesFiltered = createSelector(
  [getFiltersFavoritesOnly, getFavoriteAlbumIds],
  (favoritesOnly, ids) => favoritesOnly && ids
)

/**
 * Intersect all filtered results and return albums as an array
 */
export const getFilteredAlbumsArray = createSelector(
  getAlbums,
  getSearchFiltered,
  getDateRangeFiltered,
  getAlbumGroupsFiltered,
  getVariousArtistsFiltered,
  getRemixFiltered,
  getDuplicatesFiltered,
  getFavoritesFiltered,
  (albums, ...filtered) => intersect(filtered.filter(Array.isArray)).map((id) => albums[id])
)

/**
 * Get filtered releases as a map with release dates as keys
 */
const getFilteredReleasesMap = createSelector(getFilteredAlbumsArray, buildReleasesMap)

/**
 * Get filtered releases as ordered array of { date, albums } objects
 */
const getFilteredReleases = createSelector(getFilteredReleasesMap, buildReleases)

/**
 * Final releases selector that returns either filtered or original releases
 */
export const getReleases = createSelector(
  [getFiltersApplied, getFilteredReleases, getOriginalReleases],
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
