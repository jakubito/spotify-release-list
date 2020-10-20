import { createSelector } from 'reselect'
import orderBy from 'lodash/orderBy'
import moment from 'moment'

export const getUser = (state) => state.user
export const getSyncing = (state) => state.syncing
export const getSyncingProgress = (state) => state.syncingProgress
export const getLastSync = (state) => state.lastSync
export const getPreviousSyncMaxDate = (state) => state.previousSyncMaxDate
export const getToken = (state) => state.token
export const getTokenExpires = (state) => state.tokenExpires
export const getTokenScope = (state) => state.tokenScope
export const getNonce = (state) => state.nonce
export const getAlbums = (state) => state.albums
export const getSettings = (state) => state.settings
export const getSettingsModalVisible = (state) => state.settingsModalVisible
export const getResetModalVisible = (state) => state.resetModalVisible
export const getPlaylistModalVisible = (state) => state.playlistModalVisible
export const getErrorMessage = (state) => state.errorMessage
export const getPlaylistForm = (state) => state.playlistForm
export const getPlaylistId = (state) => state.playlistId
export const getCreatingPlaylist = (state) => state.creatingPlaylist
export const getSeenFeatures = (state) => state.seenFeatures

export const getSettingsGroups = createSelector(getSettings, (settings) => settings.groups)
export const getSettingsDays = createSelector(getSettings, (settings) => settings.days)
export const getSettingsMarket = createSelector(getSettings, (settings) => settings.market)
export const getSettingsTheme = createSelector(getSettings, (settings) => settings.theme)
export const getSettingsUriLinks = createSelector(getSettings, (settings) => settings.uriLinks)
export const getSettingsCovers = createSelector(getSettings, (settings) => settings.covers)

export const getWorking = createSelector(
  getSyncing,
  getCreatingPlaylist,
  (syncing, creatingPlaylist) => syncing || creatingPlaylist
)

export const getLastSyncDate = createSelector(
  getLastSync,
  (lastSync) => lastSync && new Date(lastSync)
)

export const getReleasesMap = createSelector(getAlbums, (albums) =>
  Object.values(albums).reduce(
    (map, album) => ({
      ...map,
      [album.releaseDate]: [...(map[album.releaseDate] || []), album],
    }),
    {}
  )
)

export const getReleasesSortedEntries = createSelector(getReleasesMap, (releasesMap) => {
  const entriesOriginal = Object.entries(releasesMap)
  const entriesSortedByDay = orderBy(entriesOriginal, ([day]) => day, 'desc')
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
  getReleasesMinDate,
  getReleasesMaxDate,
  (minDate, maxDate) => [moment(minDate), moment(maxDate)]
)
