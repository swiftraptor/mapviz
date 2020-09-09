// types contains all type defs for the visualisation component

export const LOAD_MAP = 'LOAD_MAP';
export const LOAD_MAP_SUCCESS = 'LOAD_MAP_SUCCESS';
export const LOAD_MAP_FAILED = 'LOAD_MAP_FAILED';
export const ZOOM_MAP = 'ZOOM_MAP';

export interface Bounds {
    northEast: object,
    southWest: object
}

export interface MapViewport {
    center?: [number, number],
    zoom?: number
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

export interface MapState {
    isLoading: boolean,
    map: any,
    error: Error | undefined,
    viewport?: MapViewport,
    bounds?: Bounds
}

export type ReduxActionTypes = LoadMapAction | LoadMapSuccessAction | LoadMapFailedAction | ZoomMapAction;