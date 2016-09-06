import React from 'react';

export default class Path extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const d = this.props.node,
      p = "M" + d.y + "," + d.x
      + "C" + (d.parent.y) + "," + d.x
      + " " + (d.parent.y) + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x;

    return <path className='link'
                 d={p}/>
  }
}