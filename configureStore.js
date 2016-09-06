/* global devToolsExtension */
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
const initialState = { };

export default function configureStore(preloadedState = initialState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk),
      typeof devToolsExtension === 'function' ? devToolsExtension() : f => f
    )
  );

  return store;
}
