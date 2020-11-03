import { getHasReleases, getLastSyncDate, getSyncing } from 'state/selectors'

/**
 * @param {State} state
 * @returns {State}
 */
export function hideModals(state) {
  return {
    ...state,
    settingsModalVisible: false,
    resetModalVisible: false,
    playlistModalVisible: false,
  }
}

/**
 * @param {State} state
 * @returns {State}
 */
export function showSettingsModal(state) {
  const syncing = getSyncing(state)

  if (syncing) {
    return state
  }

  return { ...hideModals(state), settingsModalVisible: true }
}

/**
 * @param {State} state
 * @returns {State}
 */
export function showPlaylistModal(state) {
  const syncing = getSyncing(state)
  const lastSyncDate = getLastSyncDate(state)
  const hasReleases = getHasReleases(state)

  if (syncing || !lastSyncDate || !hasReleases) {
    return state
  }

  return { ...hideModals(state), playlistModalVisible: true }
}

/**
 * @param {State} state
 * @returns {State}
 */
export function showResetModal(state) {
  if (!state.settingsModalVisible) {
    return state
  }

  return { ...hideModals(state), resetModalVisible: true }
}
