import store from './store/store';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MapPage from './components/MapPage';

ReactDOM.render((
  <Provider store={store}>
      <MapPage/>
  </Provider>
), document.getElementById('app'));
