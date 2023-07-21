import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const configureStore = preloadedState => createStore(
   reducer,
   preloadedState,
   applyMiddleware(sagaMiddleware)
);

const store = configureStore();

sagaMiddleware.run(rootSaga);

export default store;