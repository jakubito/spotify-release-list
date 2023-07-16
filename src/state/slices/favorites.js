import { setFavorite, setFavoriteAll, toggleEditingFavorites } from 'state/actions'
import { getReleasesArray } from 'state/selectors'

/** @type {Pick<State, 'favorites' | 'editingFavorites'>} */
export const initialState = {
  favorites: {},
  editingFavorites: false,
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(setFavorite, (state, action) => {
      state.favorites[action.payload.id] = action.payload.selected
    })
    .addCase(setFavoriteAll, (state, action) => {
      for (const album of getReleasesArray(state)) {
        state.favorites[album.id] = action.payload
      }
    })
    .addCase(toggleEditingFavorites, (state) => {
      state.editingFavorites = !state.editingFavorites
    })
}
