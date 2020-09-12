// types contains all type defs for the visualisation component

export const LOAD_MAP = 'LOAD_MAP';
export const LOAD_MAP_SUCCESS = 'LOAD_MAP_SUCCESS';
export const LOAD_MAP_FAILED = 'LOAD_MAP_FAILED';
export const ZOOM_MAP = 'ZOOM_MAP';
export const SET_MAP_FILTER = 'SET_MAP_FILTER'; // we only need one filter at a time
export const RESET_MAP_FILTER = 'RESET_MAP_FILTER';


export interface Bounds {
    northEast: {
        lng: number,
        lat: number
    },
    southWest: {
        lng: number,
        lat: number
    }
}

export interface MapViewport {
    center?: [number, number],
    zoom?: number
}

export interface MapFilter {
    propertyName: string,
    propertyValue: any
}

export interface ZoomMapAction {
    type: typeof ZOOM_MAP,
    payload: {
        bounds: Bounds,
        viewport: MapViewport
    }
}

export interface LoadMapAction {
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

interface SetMapFilterAction {
    type: typeof SET_MAP_FILTER,
    payload: {
        filter: MapFilter
    }
}

interface ResetMapFilterAction {
    type: typeof RESET_MAP_FILTER
}


export interface MapState {
    isLoading: boolean,
    map: any,
    error: Error | undefined,
    viewport?: MapViewport,
    bounds?: Bounds,
    filter: MapFilter | undefined
}

export type ReduxActionTypes = LoadMapAction | LoadMapSuccessAction | LoadMapFailedAction | ZoomMapAction | SetMapFilterAction | ResetMapFilterAction;