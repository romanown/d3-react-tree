import {hierarchy, tree, cluster, stratify} from 'd3-hierarchy';

import {
  MAP_INITIATE_FETCH,
  MAP_FETCH_SUCCESS,
  MAP_FETCH_FAILURE,
  MAP_CLICK_EVENT,
  MAP_TICK_EVENT,
} from '../actions/map-actions';

import {
  DISPLAY_DIMENSIONS,
  NODE_STATE_ENTER,
  NODE_STATE_LEAVE
} from '../components/constants';

const initialState = {
  mapData: null,
  mapDataLoaded: false,
  mapUpdated: false,
  descendants: null,
  nodes: null,
  root: null,
  tree: null,
};

export default function mapData(state = initialState, action) {
  const actionReducer = ({
    [MAP_FETCH_SUCCESS]: act =>
      Object.assign({}, state, mapCreateTree(act.mapData), {mapDataLoaded: true }),
    [MAP_FETCH_FAILURE]: () =>
      Object.assign({}, state, { mapData: null, mapDataLoaded: false }),
    [MAP_INITIATE_FETCH]: act =>
      Object.assign({}, state, { mapDataLoaded: false }),
    [MAP_CLICK_EVENT]: act =>
      Object.assign({}, state, clickEvent(state.tree, state.root, state.descendants, act.sourceNode)),
    [MAP_TICK_EVENT]: act =>
      Object.assign({}, state, tickEvent(state.tree, state.root, state.descendants, act.sourceNode, act.t))
  })

  [action.type] || (() => state);

  return actionReducer(action);
}

function collapse(d, state = null) {
  d.state = state ? state : d.state;
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function mapCreateTree(mapData) {
  const height = DISPLAY_DIMENSIONS.height - DISPLAY_DIMENSIONS.top - DISPLAY_DIMENSIONS.bottom,
    width = DISPLAY_DIMENSIONS.width - DISPLAY_DIMENSIONS.right - DISPLAY_DIMENSIONS.left;

  let mapTree = cluster().size([height, width]);
  let root = hierarchy(mapData);
  let nodes = mapTree(root);

  root.x0 = height / 2;
  root.y0 = 0;

  let i = 0;
  function init(d) {
    d.id = i += 1;
    if (d.children) {
      d.children.forEach(init);
    }
  }
  nodes.children.forEach(init);
  nodes.children.forEach(collapse);

  nodes = mapTree(root);

  const descendants = nodes.descendants();
  descendants.forEach((d) => {
    d.state = NODE_STATE_ENTER;
    d.y = d.depth * 180;
    d.x0 = d.x;
    d.y0 = d.y;
    d.id = i += 1;
  });

  return {root: root, tree: mapTree, descendants: descendants, mapUpdated: true};
}

function interpolator(t, a, b) {
  return a * (1 - t) + b * t;
}

function tickEvent(mapTree, root, descendants, sourceNode, t) {
  let tNode = null,
    sNode = null;

  descendants.forEach((d) => {
    sNode = sourceNode;
    tNode = d;
    switch(d.state) {
    case NODE_STATE_ENTER:
      sNode = sourceNode;
      tNode = d;
      break;

    case NODE_STATE_LEAVE:
      tNode = sNode;
      sNode = d;
      break;

    default:
      sNode = d;
      tNode = d;
    }

    d.x = interpolator(t, sNode.x, tNode.x0);
    d.y = interpolator(t, sNode.y, tNode.y0);
  });

  return {
    mapUpdated: false,
    elapsed: t,
    descendants: t === 1 ? tickComplete(mapTree, root, descendants, sourceNode) : descendants
  };
}

function tickComplete(mapTree, root, descendants, sourceNode) {
  let isLeaving = sourceNode.children ? sourceNode.children[0].state === NODE_STATE_LEAVE : false;

  descendants.forEach((d) => delete d.state);

  if (!sourceNode.children || !isLeaving) {
    return descendants;
  }

  sourceNode._children = sourceNode.children;
  sourceNode.children = null;

  const desc = mapTree(root).descendants();
  desc.forEach((d) => d.y = d.depth * 180);
  return desc;
}

function clickEvent(mapTree, root, xx, sourceNode) {

  if (sourceNode.children || sourceNode._children) {
    if (sourceNode.children) {
      sourceNode.children.forEach((d) => {
        collapse(d, NODE_STATE_LEAVE);
      });
    } else {
      sourceNode.children = sourceNode._children;
      sourceNode._children = null;
      sourceNode.children.forEach((d) => {
        d.state = NODE_STATE_ENTER;
      });
    }
  }

  let descendants = mapTree(root).descendants();
  descendants.forEach((d) => {
    let y = d.depth * 180;
    let x = d.x0;

    d.x0 = d.state ? d.state === NODE_STATE_LEAVE ? sourceNode.x : d.x : d.x;
    d.y0 = d.state ? d.state === NODE_STATE_LEAVE ? sourceNode.y : y : y;

    d.x = d.state && d.state === NODE_STATE_ENTER ? sourceNode.x : x !== d.x ? x : d.x;
    d.y = d.state && d.state === NODE_STATE_ENTER ? sourceNode.y : y;

  });

  return { descendants: descendants, mapUpdated: true, sourceNode: sourceNode };
}


