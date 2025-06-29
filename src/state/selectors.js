import { createSelector } from 'reselect'
import { createDraftSafeSelector } from '@reduxjs/toolkit'
import moment from 'moment'
import Fuse from 'fuse.js'
import intersect from 'fast_array_intersect'
import last from 'lodash/last'
import isEqual from 'lodash/isEqual'
import escapeRegExp from 'lodash/escapeRegExp'
import { AlbumGroup } from 'enums'
import { includesTruthy, getReleasesBetween, merge, hasVariousArtists } from 'helpers'
import { buildReleases, buildReleasesMap } from 'helpers'
import { albumsNew } from 'albums'
import { initialState } from './reducer'

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
export const getUpdatePlaylistModalVisible = (state) => state.updatePlaylistModalVisible

/** @param {State} state */
export const getFiltersVisible = (state) => state.filtersVisible

/** @param {State} state */
export const getMessage = (state) => state.message

/** @param {State} state */
export const getPlaylistForm = (state) => state.playlistForm

/** @param {State} state */
export const getPlaylistResult = (state) => state.playlistResult

/** @param {State} state */
export const getLoadingPlaylists = (state) => state.loadingPlaylists

/** @param {State} state */
export const getCreatingPlaylist = (state) => state.creatingPlaylist

/** @param {State} state */
export const getUpdatingPlaylist = (state) => state.updatingPlaylist

/** @param {State} state */
export const getPlaylists = (state) => state.playlists

/** @param {State} state */
export const getSelectedPlaylistId = (state) => state.selectedPlaylistId

/** @param {State} state */
export const getLastPlaylistsRefresh = (state) => state.lastPlaylistsRefresh

/** @param {State} state */
export const getFilters = (state) => state.filters

/** @param {State} state */
export const getUpdateReady = (state) => state.updateReady

/** @param {State} state */
export const getFavorites = (state) => state.favorites

/** @param {State} state */
export const getEditingFavorites = (state) => state.editingFavorites

/** @param {State} state */
export const getLastSettingsPath = (state) => state.lastSettingsPath

/** @param {State} state */
export const getLabelBlocklistHeight = (state) => state.labelBlocklistHeight

// Individual settings selectors
export const getSettingsArtistSources = createSelector(
  getSettings,
  (settings) => settings.artistSources
)
export const getSettingsGroups = createSelector(getSettings, (settings) => settings.groups)
export const getSettingsGroupColors = createSelector(
  getSettings,
  (settings) => settings.groupColors
)
export const getSettingsDays = createSelector(getSettings, (settings) => settings.days)
export const getSettingsTheme = createSelector(getSettings, (settings) => settings.theme)
export const getSettingsUriLinks = createSelector(getSettings, (settings) => settings.uriLinks)
export const getSettingsCovers = createSelector(getSettings, (settings) => settings.covers)
export const getSettingsReleasesOrder = createSelector(
  getSettings,
  (settings) => settings.releasesOrder
)
export const getSettingsTrackHistory = createSelector(
  getSettings,
  (settings) => settings.trackHistory
)

export const getSettingsLabelBlocklist = createSelector(
  getSettings,
  (settings) => settings.labelBlocklist
)

export const getSettingsBlockedLabels = createSelector(getSettingsLabelBlocklist, (blocklist) => {
  /** @type {BlockedLabels} */
  const labels = {}
  const matches = blocklist.matchAll(/^\s*(?:\*(\S*)\*)?\s*(.*?)\s*$/gm)
  for (const [, flags, label] of matches) {
    labels[label] = flags?.split(',')
  }
  return labels
})

export const getSettingsArtistBlocklist = createSelector(
  getSettings,
  (settings) => settings.artistBlocklist
)

export const getSettingsBlockedArtists = createSelector(getSettingsArtistBlocklist, (blocklist) => {
  /** @type {string[]} */
  const artistIds = []
  const matches = blocklist.matchAll(/^\s*([a-zA-Z0-9]{22})\s*$/gm)
  for (const match of matches) artistIds.push(match[1])
  return artistIds
})

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
export const getFiltersNewOnly = createSelector(getFilters, (filters) => filters.newOnly)
export const getFiltersMinTracks = createSelector(getFilters, (filters) => filters.minTracks)
export const getFiltersMaxTracks = createSelector(getFilters, (filters) => filters.maxTracks)

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
  (appData) => !isEqual(appData, getAppData(initialState))
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
  getFiltersNewOnly,
  getFiltersMinTracks,
  getFiltersMaxTracks,
  (groups, search, startDate, endDate, excludeVA, excludeRemixes, excludeDuplicates, favoritesOnly, newOnly, minTracks, maxTracks) => 
    Boolean(groups.length) || Boolean(search) || Boolean(startDate) || Boolean(endDate) || 
    excludeVA || excludeRemixes || excludeDuplicates || favoritesOnly || newOnly || 
    Boolean(minTracks) || Boolean(maxTracks)
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
const getOriginalReleases = createSelector(
  [getOriginalReleasesMap, getSettingsReleasesOrder],
  buildReleases
)

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
      threshold: 0.1,
      keys: Object.values(AlbumGroup)
        .map((group) => `artists.${group}.name`)
        .concat('name', 'label'),
    })
)

/**
 * Get all non-"Various Artists" album IDs
 */
const getNonVariousArtistsAlbumIds = createSelector(getAlbumsArray, (albums) =>
  albums.reduce((ids, album) => {
    if (!hasVariousArtists(album)) ids.push(album.id)
    return ids
  }, /** @type {string[]} */ ([]))
)

/**
 * Get all non-"Remix" album IDs
 */
const getNonRemixAlbumIds = createSelector(getAlbumsArray, (albums) =>
  albums.reduce((ids, album) => {
    if (!/remix/i.test(album.name)) ids.push(album.id)
    return ids
  }, /** @type {string[]} */ ([]))
)

/**
 * Get album IDs with duplicates removed
 */
const getNoDuplicatesAlbumIds = createSelector(getOriginalReleases, (releases) => {
  const charsMap = { '[': '(', ']': ')', ''': "'" }
  }
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
 * Get new album ids
 */
const getNewAlbumIds = createSelector(getAlbumsArray, (albums) =>
  albums.filter((album) => albumsNew.has(album.id)).map((album) => album.id)
)

/**
 * Get album IDs based on track count filter
 */
const getTracksFiltered = createSelector(
  [getFiltersMinTracks, getFiltersMaxTracks, getAlbumsArray],
  (minTracks, maxTracks, albums) => {
    if (!minTracks && !maxTracks) return null
    
    return albums.reduce((ids, album) => {
      const trackCount = album.totalTracks
      const meetsMin = !minTracks || trackCount >= minTracks
      const meetsMax = !maxTracks || trackCount <= maxTracks
      
      if (meetsMin && meetsMax) {
        ids.push(album.id)
      }
      
      return ids
    }, /** @type {string[]} */ ([]))
  }
)

/**
 * Get album IDs based on search filter
 */
const getSearchFiltered = createSelector(
  [getFiltersSearch, getFuseInstance],
  (query, fuse) => query && fuse.search(query.trim()).map((result) => result.item.id)
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
 * Get new album ids if new filter and history tracking are enabled
 */
const getNewFiltered = createSelector(
  [getSettingsTrackHistory, getFiltersNewOnly, getNewAlbumIds],
  (trackHistory, newOnly, ids) => trackHistory && newOnly && ids
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
  getNewFiltered,
  getTracksFiltered,
  (albums, ...filtered) => intersect(filtered.filter(Array.isArray)).map((id) => albums[id])
)

/**
 * Get filtered releases as a map with release dates as keys
 */
const getFilteredReleasesMap = createSelector(getFilteredAlbumsArray, buildReleasesMap)

/**
 * Get filtered releases as ordered array of { date, albums } objects
 */
const getFilteredReleases = createSelector(
  [getFilteredReleasesMap, getSettingsReleasesOrder],
  buildReleases
)

/**
 * Final releases selector that returns either filtered or original releases
 */
export const getReleases = createSelector(
  [getFiltersApplied, getFilteredReleases, getOriginalReleases],
  (filtersApplied, filtered, original) => (filtersApplied ? filtered : original)
)

/**
 * Get final releases array
 */
export const getReleasesArray = createDraftSafeSelector(
  [getFiltersApplied, getFilteredAlbumsArray, getAlbumsArray],
  (filtersApplied, filtered, original) => (filtersApplied ? filtered : original)
)

/**
 * Check if there are any releases currently displayed
 */
export const getHasReleases = createSelector(getReleasesArray, (albums) => Boolean(albums.length))

/**
 * Get final releases track count
 */
export const getReleasesTrackCount = createSelector(getReleasesArray, (albums) =>
  albums.reduce((count, album) => count + album.totalTracks, 0)
)

/** @param {State} state */
export const getAnyModalVisible = createSelector(
  [getPlaylistModalVisible, getUpdatePlaylistModalVisible],
  (...values) => includesTruthy(values)
)