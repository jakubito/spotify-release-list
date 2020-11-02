import { AlbumGroup } from 'enums'
import { initialState } from 'state'

/** @type {{ [version: number]: (state: PersistedState) => PersistedState }} */
const migrations = {
  0: (state) => {
    const albumGroupValues = Object.values(AlbumGroup)
    const groupsSorted = state.settings.groups.sort(
      (first, second) => albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second)
    )

    return { ...state, settings: { ...state.settings, groups: groupsSorted } }
  },
  1: (state) => {
    return { ...state, ...initialState, settings: state.settings }
  },
}

export default migrations
