import { AlbumGroup } from 'enums'
import { getFiltersVisible, getHasOriginalReleases } from 'state/selectors'
import { initialState } from './reducer'

/** @type {{ [version: number]: (state: PersistedState) => PersistedState }} */
const migrations = {
  0: (state) => {
    const albumGroupValues = Object.values(AlbumGroup)
    const groupsSorted = state.settings.groups.sort(
      (first, second) => albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second)
    )

    return { ...state, settings: { ...state.settings, groups: groupsSorted } }
  },
  1: (state) => resetDataWithMessage(state),
  2: (state) => resetDataWithMessage(state),
  3: (state) => {
    // Fix persisted buggy state causing black screen
    if (getFiltersVisible(state) && !getHasOriginalReleases(state)) {
      return { ...state, filtersVisible: false }
    }

    return state
  },
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
    ...initialState,
    settings: state.settings,
    message: {
      text: 'The app has been updated to the latest version. Please log in again to continue.',
      type: 'normal',
    },
  }
}

export default migrations
