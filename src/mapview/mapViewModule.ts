// redux module code here
import { ActionsObservable } from 'redux-observable';
import { isOfType } from 'typesafe-actions';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { createSelector } from 'reselect';
import { LOAD_MAP, LOAD_MAP_FAILED, LOAD_MAP_SUCCESS, LoadMapAction, ReduxActionTypes, MapState } from './types'

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
    error: undefined
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
        
        default:
            return state
    }
}

// TODO figure out geojson structure so we can improve mapstate object
export const getMap = (state: MapState) => state.map.map// improve this
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