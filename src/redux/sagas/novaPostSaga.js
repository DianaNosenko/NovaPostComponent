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
    yield put({ type: ACTION.NOVA_POST_REQUEST});
    try {
        const {data:{data}} = yield request(action.data)
        if(data){
            yield put({ type: ACTION.GET_WAREHOUSES_DATA_SUCCESS, data});
        }
        
    } catch (error) {
        yield put({ type: ACTION.NOVA_POST_ERROR, error});

    }
}