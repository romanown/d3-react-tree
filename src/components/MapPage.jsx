import React from 'react';
import { connect } from 'react-redux';

import TreeMap from './TreeMap';
import * as MapActions from '../actions/map-actions';

function mapStateToProps({ mapData }) {
  return { mapData };
}

class MapPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(MapActions.mapInitiateFetch({}));
  }

  render() {
    return (
      <div className="map-main">
        {(() => {
          return this.props.mapData.mapDataLoaded ?
            <TreeMap
              data={this.props.mapData}
              dispatch={this.props.dispatch}/> :
            null;
        })()}
      </div>
    );
  }
};

MapPage.propTypes = {
  mapData: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(MapPage);
