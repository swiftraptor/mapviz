import { Epic, ActionsObservable } from 'redux-observable';
import { isOfType } from 'typesafe-actions';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


const LOAD_MAP = 'LOAD_MAP';
const LOAD_MAP_SUCCESS = 'LOAD_MAP_SUCCESS';
const LOAD_MAP_FAILED = 'LOAD_MAP_FAILED';

const loadMapRequest = () => ajax(`${process.env.PUBLIC_URL}/data/boat_ramps.geojson`)

interface LoadMapAction {
    type: typeof LOAD_MAP
};

interface LoadMapSuccessAction {
    type: typeof LOAD_MAP_SUCCESS
    payload: {
        map: object
    }
};

interface LoadMapFailedAction {
    type: typeof LOAD_MAP_FAILED
    payload: {
        error: Error
    }
};

export type ReduxActionTypes = LoadMapAction | LoadMapSuccessAction | LoadMapFailedAction;


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

interface MapState {
    isLoading: boolean,
    map: any,
    error: Error | undefined,
}

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

export const getMap = (state: MapState) => state.map.map // improve this