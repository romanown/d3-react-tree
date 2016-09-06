/* global devToolsExtension */
import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

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
