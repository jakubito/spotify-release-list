import {
  ADD_SEEN_FEATURE,
  SET_SETTINGS,
  SHOW_PLAYLIST_MODAL,
  SHOW_SETTINGS_MODAL,
  SYNC,
  TOGGLE_FILTERS_VISIBLE,
} from 'state/actions'
import {
  getHasOriginalReleases,
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
function valid({ type, payload }, state) {
  switch (type) {
    case SYNC:
      return !getModalVisible(state)
    case SHOW_SETTINGS_MODAL:
      return !getSyncing(state)
    case SHOW_PLAYLIST_MODAL:
      return !getSyncing(state) && getLastSyncDate(state) && getHasReleases(state)
    case ADD_SEEN_FEATURE:
      return !getSeenFeatures(state).includes(payload.feature)
    case SET_SETTINGS:
      return !payload.settings.groups || payload.settings.groups.length > 0
    case TOGGLE_FILTERS_VISIBLE:
      return (
        !getModalVisible(state) &&
        !getSyncing(state) &&
        getLastSyncDate(state) &&
        getHasOriginalReleases(state)
      )
    default:
      return true
  }
}

/**
 * Middleware for validating incoming actions
 *
 * @type {import('redux').Middleware<{}, State>}
 */
const guardMiddleware = (store) => (next) => (action) => {
  if (valid(action, store.getState())) {
    return next(action)
  }
}

export default guardMiddleware
