import React, { FunctionComponent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMap, loadMap } from '../redux/map.module';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';

export const MapComponent: FunctionComponent<{}> = ({}) => {
    const map = useSelector(getMap);
    const dispatch = useDispatch();
    const center = [-28.016666, 153.399994];

    useEffect(() => {
        console.log('map mount');
        dispatch(loadMap());
    }, [dispatch]); //dispatch is stable
    console.log(map);
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

export default MapComponent;
