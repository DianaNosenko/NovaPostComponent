import { put } from 'redux-saga/effects';
import ACTION from '../actionTypes'
import { request } from '../../api/novaPost';

export function* getCitiesDataSaga(action) {
    yield put({ type: ACTION.NOVA_POST_REQUEST});
    try {
        const {data:{data}} = yield request(action.data)
        if(data){
            yield put({ type: ACTION.GET_CITIES_DATA_SUCCESS, data});
        }
    } catch (error) {
        yield put({ type: ACTION.NOVA_POST_ERROR, error});

    }
}

export function* getWarehousesDataSaga(action) {
    console.log(action)
    yield put({ type: ACTION.NOVA_POST_REQUEST});
    if(action.data.newCity){
        yield put({ type: ACTION.SET_CLEAR_WAREHOUSES_DATA});
    }
    try {
        const {data:{data}} = yield request(action.data.data)
        if(data){
            yield put({ type: ACTION.GET_WAREHOUSES_DATA_SUCCESS, data});
        }
        
    } catch (error) {
        yield put({ type: ACTION.NOVA_POST_ERROR, error});

    }
}