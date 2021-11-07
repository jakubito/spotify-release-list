import { AlbumGroup } from 'enums'
import { getFiltersVisible, getHasOriginalReleases } from 'state/selectors'
import { INITIAL_STATE } from './reducer'

/** @type {{ [version: number]: (state: PersistedState) => PersistedState }} */
const migrations = {
  0: (state) => {
    const albumGroupValues = Object.values(AlbumGroup)
    const groupsSorted = state.settings.groups.sort(
      (first, second) => albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second)
    )

    return { ...state, settings: { ...state.settings, groups: groupsSorted } }
  },
  1: resetDataWithMessage,
  2: resetDataWithMessage,
  3: (state) => {
    // Fix persisted buggy state causing black screen
    if (getFiltersVisible(state) && !getHasOriginalReleases(state)) {
      return { ...state, filtersVisible: false }
    }

    return state
  },
  4: resetDataWithMessage,
  5: resetDataWithMessage,
}

/**
 * Reset all data except settings and show message
 *
 * @param {PersistedState} state
 * @returns {PersistedState}
 */
function resetDataWithMessage(state) {
  return {
    ...state,
    ...INITIAL_STATE,
    settings: state.settings,
    message: {
      text: 'Please log in again to continue.',
      type: 'info',
    },
  }
}

export default migrations
