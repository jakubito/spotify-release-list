import { dismissUpdate, updateReady } from 'state/actions'

/** @type {Pick<State, 'updateReady'>} */
export const initialState = {
  updateReady: false,
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(updateReady, (state) => {
      state.updateReady = true
    })
    .addCase(dismissUpdate, (state) => {
      state.updateReady = false
    })
}
