import { reducer as mapReducer, loadMapEpic } from './mapview/mapViewModule';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'

const rootEpic = combineEpics(
    loadMapEpic
);

const rootReducer = combineReducers({
    map: mapReducer
});

const epicMiddleware = createEpicMiddleware();

// todo add redux middleware
const configureStore = (): Store => {
    const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(epicMiddleware))
    );
    epicMiddleware.run(rootEpic);
    return store;
};

export default configureStore;