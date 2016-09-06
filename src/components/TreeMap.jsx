import React from 'react';

import { timer } from 'd3-timer';
import { DISPLAY_DIMENSIONS } from './constants';
import Node from './Node';
import Link from './Link';
import * as MapActions from '../actions/map-actions';

class TreeMap extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClick = (...evt) => this.handleOnClickEvent(...evt);

    this.transition = null;
  }

  componentDidMount() {
    this.doTransition();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.mapUpdated) {
      this.doTransition(nextProps.data.sourceNode);
    }
  }

  doTransition(sourceNode) {
    const duration = 750;

    if (this.transition) {
      this.transition.stop();
      this.transition = null;
    }

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration) : 1;
      this.props.dispatch(MapActions.tickEvent(sourceNode ? sourceNode : this.props.data.descendants[0], t));
      if (t === 1) {
        this.transition.stop();
      }
    }, 0);
  }

  handleOnClickEvent(evt, node) {
    this.props.dispatch(MapActions.clickEvent(node));
  }

  render() {
    return (
      <div className="map-container" style={{width: DISPLAY_DIMENSIONS.width, height: DISPLAY_DIMENSIONS.height}}>
        <svg width={DISPLAY_DIMENSIONS.width} height={DISPLAY_DIMENSIONS.height}>
          <g transform={'translate(' + DISPLAY_DIMENSIONS.left + ',' + DISPLAY_DIMENSIONS.top + ')'}>
            {this.props.data.descendants.slice(1).map((node) => {
              return <Link key={'l' + node.id} node={node}/>;
            })}
            {this.props.data.descendants.map((node) => {
              return <Node handleOnClick={this.handleOnClick}
                           key={node.id}
                           elapsed={this.props.data.elapsed}
                           node={node}/>;
            })}
          </g>
        </svg>
      </div>
    );
  }
}

TreeMap.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
};

export default TreeMap;