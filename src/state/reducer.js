import { createReducer } from '@reduxjs/toolkit'
import { reset } from 'state/actions'
import slices from 'state/slices'
import demoState from './demoState.json'

export const initialState = /** @type {State} */ (demoState)

const rootReducer = createReducer(initialState, (builder) => {
  for (const slice of slices) slice.bind(builder)
  builder.addCase(reset, (state) => {
    Object.assign(state, initialState)
  })
})

export default rootReducer
