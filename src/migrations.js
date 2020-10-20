import { AlbumGroup } from 'enums'
import { initialState } from 'store'

export default {
  0: (state) => {
    const albumGroupValues = Object.values(AlbumGroup)
    const groupsSorted = state.settings.groups.sort(
      (first, second) => albumGroupValues.indexOf(first) - albumGroupValues.indexOf(second)
    )

    return {
      ...state,
      settings: {
        ...state.settings,
        groups: groupsSorted,
      },
    }
  },
  1: (state) => {
    return {
      ...initialState,
      settings: state.settings,
    }
  },
}
