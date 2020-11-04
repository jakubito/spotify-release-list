import { ADD_SEEN_FEATURE, SHOW_PLAYLIST_MODAL, SHOW_SETTINGS_MODAL, SYNC } from 'state/actions'
import {
  getHasReleases,
  getLastSyncDate,
  getModalVisible,
  getSeenFeatures,
  getSyncing,
} from 'state/selectors'

/**
 * Check if action can be dispatched
 *
 * @param {Action} action
 * @param {State} state
 * @returns {boolean}
 */
function isActionValid({ type, payload }, state) {
  switch (type) {
    case SYNC:
      return !getModalVisible(state)
    case SHOW_SETTINGS_MODAL:
      return !getSyncing(state)
    case SHOW_PLAYLIST_MODAL:
      return !getSyncing(state) && getLastSyncDate(state) && getHasReleases(state)
    case ADD_SEEN_FEATURE:
      return !getSeenFeatures(state).includes(payload.feature)
    default:
      return true
  }
}

/**
 * Middleware for validating incoming actions
 *
 * @type {import('redux').Middleware<{}, State>}
 */
const actionGuardMiddleware = (store) => (next) => (action) => {
  if (isActionValid(action, store.getState())) {
    return next(action)
  }
}

export default actionGuardMiddleware
