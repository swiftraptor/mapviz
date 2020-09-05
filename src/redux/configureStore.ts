import { reducer as mapReducer, loadMapEpic } from './map.module';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { createStore, combineReducers, applyMiddleware, Store } from 'redux';

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
        applyMiddleware(epicMiddleware)
    );
    epicMiddleware.run(rootEpic);
    return store;
};

export default configureStore;