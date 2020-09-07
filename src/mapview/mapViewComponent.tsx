import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { getMap, loadMap, groupByMaterial } from './mapViewModule';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';

const MapViewComponent: FunctionComponent<{ map: any, loadMap: () => {} }> = ({ map, loadMap }) => {
    loadMap();
    const center = [-28.016666, 153.399994];

    return (
        <div className="mapview">
            { 
                Object.keys(map).length > 0 ? (
                    <Map zoom={14} center={center}>
                                <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
                        <GeoJSON data={map} />
                    </Map>
                ): null
            }
        </div>
    );
};

const mapStateToProps = (state) => ({
    map: getMap(state),
    materials: groupByMaterial(state)
})

const mapDispatchToProps = (dispatch) => ({
    loadMap: () => dispatch(loadMap())  
})

export default connect(mapStateToProps, mapDispatchToProps)(MapViewComponent);
