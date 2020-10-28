import { createSelector } from 'reselect'
import orderBy from 'lodash/orderBy'
import moment from 'moment'

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
export const getErrorMessage = (state) => state.errorMessage

/** @param {State} state */
export const getPlaylistForm = (state) => state.playlistForm

/** @param {State} state */
export const getPlaylistId = (state) => state.playlistId

/** @param {State} state */
export const getCreatingPlaylist = (state) => state.creatingPlaylist

/** @param {State} state */
export const getSeenFeatures = (state) => state.seenFeatures

export const getSettingsGroups = createSelector(getSettings, (settings) => settings.groups)
export const getSettingsDays = createSelector(getSettings, (settings) => settings.days)
export const getSettingsMarket = createSelector(getSettings, (settings) => settings.market)
export const getSettingsTheme = createSelector(getSettings, (settings) => settings.theme)
export const getSettingsUriLinks = createSelector(getSettings, (settings) => settings.uriLinks)
export const getSettingsCovers = createSelector(getSettings, (settings) => settings.covers)

export const getWorking = createSelector(
  [getSyncing, getCreatingPlaylist],
  (syncing, creatingPlaylist) => syncing || creatingPlaylist
)

export const getLastSyncDate = createSelector(
  getLastSync,
  (lastSync) => lastSync && new Date(lastSync)
)

export const getReleasesMap = createSelector(getAlbums, (albums) => {
  /** @type {{ [date: string]: AlbumGrouped[] }} */
  const releasesMap = Object.values(albums).reduce(
    (map, album) => ({
      ...map,
      [album.releaseDate]: [...(map[album.releaseDate] || []), album],
    }),
    {}
  )

  return releasesMap
})

export const getReleasesSortedEntries = createSelector(getReleasesMap, (releasesMap) => {
  const entriesOriginal = Object.entries(releasesMap)
  const entriesSortedByDay = orderBy(entriesOriginal, ([day]) => day, 'desc')
  /** @type {[string, AlbumGrouped[]][]} */
  const entries = entriesSortedByDay.map(([day, albums]) => [day, orderBy(albums, 'name')])

  return entries
})

export const getHasReleases = createSelector(getReleasesSortedEntries, (entries) =>
  Boolean(entries.length)
)

export const getReleasesMinDate = createSelector(getReleasesSortedEntries, (entries) =>
  entries.length ? entries[entries.length - 1][0] : null
)

export const getReleasesMaxDate = createSelector(getReleasesSortedEntries, (entries) =>
  entries.length ? entries[0][0] : null
)

export const getReleasesMinMaxDatesMoment = createSelector(
  [getReleasesMinDate, getReleasesMaxDate],
  (minDate, maxDate) => /** @type {[Moment, Moment]} */ ([moment(minDate), moment(maxDate)])
)
