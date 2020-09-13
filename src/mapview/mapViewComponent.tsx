import React, { FunctionComponent, useRef } from 'react';
import { connect } from 'react-redux';
import { getMap, zoomMap } from './mapViewModule';
import { Map, GeoJSON, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';

const markerIcon = new Leaflet.Icon({
    iconUrl: `${process.env.PUBLIC_URL}/map_marker.svg`,
    iconSize: [40, 60]
})

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
                        {map.features.map(feature => (
                            <Marker
                            position={[
                                feature.geometry.coordinates[0][0][0][1],
                                feature.geometry.coordinates[0][0][0][0]
                            ]}
                            icon={markerIcon}
                            >
                                <Popup>
                                    {feature.properties.asset_numb}
                                </Popup>
                            </Marker>
                        ))}
                    </Map>
                ): null
            }
        </div>
    );
};

const mapStateToProps = (state) => ({
    map: getMap(state),
})

const mapDispatchToProps = (dispatch) => ({
    onZoom: (bounds: { _northEast: { lat: number, lng: number }, _southWest: { lat: number, lng: number } }, viewport: { center?: [number, number], zoom?: number }) => {
        // dispatch action here to do funky calculations
        dispatch(zoomMap({ northEast: bounds._northEast, southWest: bounds._southWest }, viewport))
    }  
})

export default connect(mapStateToProps, mapDispatchToProps)(MapViewComponent);
