import { AlbumGroup } from 'enums'
import { initialState } from 'state'

/** @typedef {import('redux-persist').PersistedState & State} PersistedState */

export default {
  /** @param {PersistedState} state */
  0: (state) => {
    const albumGroupValues = Object.values(AlbumGroup)
    const groupsSorted = state.settings.groups.sort(
      (first, second) => albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second)
    )

    return { ...state, settings: { ...state.settings, groups: groupsSorted } }
  },
  /** @param {PersistedState} state */
  1: (state) => {
    return { ...state, ...initialState, settings: state.settings }
  },
}
