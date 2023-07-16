import { createReducer } from '@reduxjs/toolkit'
import { reset } from 'state/actions'
import slices from 'state/slices'

export const initialState = slices.reduce((state, slice) => {
  Object.assign(state, slice.initialState)
  return state
}, /** @type {State} */ ({}))

const rootReducer = createReducer(initialState, (builder) => {
  for (const slice of slices) slice.bind(builder)
  builder.addCase(reset, (state) => {
    Object.assign(state, initialState)
  })
})

export default rootReducer
