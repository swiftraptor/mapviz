// redux module code here
import { ActionsObservable } from 'redux-observable';
import { isOfType } from 'typesafe-actions';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { createSelector } from 'reselect';
import { LOAD_MAP, LOAD_MAP_FAILED, LOAD_MAP_SUCCESS, LoadMapAction, ReduxActionTypes, MapState, Bounds, MapViewport, ZOOM_MAP, SET_MAP_FILTER, RESET_MAP_FILTER } from './types'

const loadMapRequest = () => ajax(`${process.env.PUBLIC_URL}/data/boat_ramps.geojson`)

export const loadMap = (): ReduxActionTypes => {
    return {
        type: LOAD_MAP
    };
};


const loadMapSuccess = (map: object): ReduxActionTypes => {
    return {
        type: LOAD_MAP_SUCCESS,
        payload: {
            map: map // prefer explicit assignment over implicit
        }
    }
}

const loadMapFailed = (error: Error): ReduxActionTypes => {
    return {
        type: LOAD_MAP_FAILED,
        payload: {
            error: error
        }
    }
}

export const zoomMap = (bounds: Bounds, viewport: MapViewport) => ({
    type: ZOOM_MAP,
    payload: {
        bounds: bounds,
        viewport: viewport
    }
})

export const setMapFilter = (propName: string, propValue: any) => ({
    type: SET_MAP_FILTER,
    payload: {
        filter: {
            propName: propName,
            propValue: propValue
        }
    }
})

export const resetMapFilter = () => ({ type: RESET_MAP_FILTER })

export const loadMapEpic = (action$: ActionsObservable<ReduxActionTypes>) => action$.pipe(
    filter(isOfType(LOAD_MAP)),
    switchMap((action: LoadMapAction) => loadMapRequest().pipe(
            map((response: AjaxResponse) => loadMapSuccess(response.response),
            catchError((error: Error) => of(loadMapFailed(error)),
        ),
    ))
))

const initialState: MapState = {
    isLoading: false,
    map: {},
    error: undefined,
    filter: undefined,
}

export const reducer = (state = initialState, action: ReduxActionTypes) => {
    switch(action.type) {
        case LOAD_MAP:
            return {
                ...state,
                isLoading: true
            }

        case LOAD_MAP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                map: action.payload.map
            }
        
        case LOAD_MAP_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
            }
        
        case ZOOM_MAP:
            // we need to project a view over the underlying map data
            return {
                ...state,
                viewport: action.payload.viewport,
                bounds: action.payload.bounds
            }
        
        case SET_MAP_FILTER:
            return {
                ...state,
                filter: action.payload.filter
            }
        
        case RESET_MAP_FILTER:
            return {
                ...state,
                filter: undefined
            }

        
        default:
            return state
    }
}

const featuresWithinBounds = (features: any[], bounds: Bounds) => {
    return features.filter(({ geometry }) => 
        geometry.coordinates[0][0][0][0] < bounds.northEast.lng
        && geometry.coordinates[0][0][0][1] < bounds.northEast.lat
        && geometry.coordinates[0][0][0][0] > bounds.southWest.lng
        && geometry.coordinates[0][0][0][1] > bounds.southWest.lat
    )
}

// this will only filter on .properties
const featuresMatchingProp = (features: any[], propName: string, propValue: any) => {
    return features.filter(feature => feature.properties[propName] === propValue)
}

// TODO figure out geojson structure so we can improve mapstate object
export const getMap = (state: MapState) => {

    // figure out what filters to apply
    const applyViewFilter = state.map.viewport && state.map.bounds
    const applyFeatureFilter = !!state.map.filter
    
    if (!applyFeatureFilter && !applyViewFilter) {
        return state.map.map;
    } else if (!applyFeatureFilter && applyViewFilter) {
        const viewFilteredFeatures = featuresWithinBounds(state.map.map.features, state.map.bounds);
        const newMap = {
            type: 'FeatureCollection',
            features: viewFilteredFeatures,
            totalFeatures: viewFilteredFeatures.length
        }
        return newMap;
    } else if (!applyViewFilter && applyFeatureFilter) {
        const featureFilteredFeatures = featuresMatchingProp(state.map.map.features, state.map.filter.propName, state.map.filter.propValue);
        const newMap = {
            type: 'FeatureCollection',
            features: featureFilteredFeatures,
            totalFeatures: featureFilteredFeatures.length
        }
        return newMap;
    } else {
        const filtered = featuresMatchingProp(
            featuresWithinBounds(state.map.map.features, state.map.bounds),
            state.map.filter.propName,
            state.map.filter.propValue
        );
        const newMap = {
            type: 'FeatureCollection',
            features: filtered,
            totalFeatures: filtered.length
        }

        return newMap;
    }
}// improve this
export const groupByMaterial = createSelector(
    getMap,
    map => {
        const obj = map.features
        ?.map(feature => ({ id: feature.id, material: feature.properties.material }))
        .reduce((accum, current) => {
            const { material } = current
            if (!accum[material]) {
                accum[material] = 1;
            } else {
                accum[material] = accum[material] + 1;
            }
            return accum;
        }, {}) || {};
        return Object.keys(obj).map(material => ({ name: material, count: obj[material] }))
    });