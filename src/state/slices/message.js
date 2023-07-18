import { hideMessage, showErrorMessage, showMessage } from 'state/actions'

/** @type {Pick<State, 'message'>} */
export const initialState = {
  message: null,
}

/** @param {ActionReducerMapBuilder} builder */
export function bind(builder) {
  builder
    .addCase(showMessage, (state, action) => {
      state.message = { text: action.payload, type: 'normal' }
    })
    .addCase(showErrorMessage, (state, action) => {
      const text = action.payload || 'Oops! Something went wrong.'
      state.message = { text, type: 'error' }
    })
    .addCase(hideMessage, (state) => {
      state.message = null
    })
}
