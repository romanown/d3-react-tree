import * as mapSource from '../sources/map-sources';

export const MAP_INITIATE_FETCH = 'MAP_INITIATE_FETCH',
    MAP_FETCH_SUCCESS = 'MAP_FETCH_SUCCESS',
    MAP_FETCH_FAILURE = 'MAP_FETCH_FAILURE',
    MAP_CLICK_EVENT = 'MAP_CLICK_EVENT',
    MAP_TICK_EVENT = 'MAP_TICK_EVENT';

export function mapInitiateFetch(filter) {
  return dispatch => {
    dispatch({ filter, type: MAP_INITIATE_FETCH });
    mapSource.fetch(filter)
      .then(mapData => dispatch(fetchSuccess(mapData)))
      .catch(err => dispatch(fetchFailure(err)));
  };
}

export function fetchSuccess(mapData) {
  return { mapData, type: MAP_FETCH_SUCCESS };
}

export function fetchFailure(message) {
  return { message, type: MAP_FETCH_FAILURE };
}

export function clickEvent(sourceNode) {
  return dispatch => {
    dispatch({sourceNode, type: MAP_CLICK_EVENT});
  };
}

export function tickEvent(sourceNode, t) {
  return dispatch => {
    dispatch({sourceNode, t, type: MAP_TICK_EVENT});
  };
}
