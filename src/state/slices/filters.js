import { resetFilters, setFilters, toggleFiltersVisible } from 'state/actions'

/** @type {Pick<State, 'filtersVisible' | 'filters'>} */
export const initialState = {
  filtersVisible: false,
  filters: {
    groups: [],
    search: '',
    startDate: null,
    endDate: null,
    excludeVariousArtists: false,
    excludeRemixes: false,
    excludeDuplicates: false,
    favoritesOnly: false,
    newOnly: false,
  },
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(setFilters, (state, action) => {
      Object.assign(state.filters, action.payload)
    })
    .addCase(resetFilters, (state) => {
      Object.assign(state.filters, initialState.filters)
    })
    .addCase(toggleFiltersVisible, (state) => {
      state.filtersVisible = !state.filtersVisible
    })
}
