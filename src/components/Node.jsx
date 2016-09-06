import React from 'react';

import {
  NODE_STATE_ENTER,
  NODE_STATE_LEAVE
} from './constants';

export default function Node(props) {
  const d = props.node,
    t = 'translate(' + d.y + ',' + d.x + ')',
    opacity = d.state && d.state === NODE_STATE_LEAVE ? 1 - props.elapsed : 1;

  return (<g
    onClick={(evt) => props.handleOnClick(evt, d)}
    transform={t}
    className='node'>
    <circle r='4.5'
            fill={d._children ? 'lightsteelblue' : '#fff'}
    ></circle>
    <text x={d.children || d._children ? -10 : 10}
          dy='.35em'
          fillOpacity={opacity}
          textAnchor={d.children || d._children ? 'end' : 'start'}>{d.data.name}</text>
  </g>);
}
