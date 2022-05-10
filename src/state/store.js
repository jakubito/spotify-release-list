import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from 'sagas'
import rootReducer from './reducer'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({ reducer: rootReducer, middleware: [sagaMiddleware] })

/** @type {import('redux-persist').Persistor} */
export let persistor

/** @type {Promise<void>} */
export const hydrate = Promise.resolve()

sagaMiddleware.run(rootSaga)

export default store
