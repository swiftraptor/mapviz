import React, { FunctionComponent, useRef } from 'react';
import { connect } from 'react-redux';
import { getMap, loadMap, groupByMaterial, zoomMap } from './mapViewModule';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';

const MapViewComponent: FunctionComponent<{
    map: any,
    onZoom: (bounds: { northEast: object, southWest: object }, viewport: { center?: [number, number], zoom?: number }) => {} }> = ({ map, onZoom }) => {
    const center = [-28.016666, 153.399994];
    const mapRef = useRef<Map>(null);

    const zoomCallback = (viewport: { center?: [number, number], zoom?: number }) => {
        onZoom(mapRef.current?.leafletElement.getBounds(), viewport)
    }

    return (
        <div className="mapview">
            { 
                Object.keys(map).length > 0 ? (
                    <Map zoom={14} center={center} onViewportChanged={zoomCallback} ref={mapRef}>
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
    onZoom: (bounds: { northEast: object, southWest: object }, viewport: { center?: [number, number], zoom?: number }) => {
        // dispatch action here to do funky calculations
        dispatch(zoomMap(bounds, viewport))
    }  
})

export default connect(mapStateToProps, mapDispatchToProps)(MapViewComponent);
