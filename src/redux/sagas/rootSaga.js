import { takeEvery } from "redux-saga/effects";
import ACTION from "../actionTypes";

import { getCitiesDataSaga, getWarehousesDataSaga } from "./novaPostSaga";

function* rootSaga() {
  yield takeEvery(ACTION.GET_CITIES_DATA_ACTION, getCitiesDataSaga);
  yield takeEvery(ACTION.GET_WAREHOUSES_DATA_ACTION, getWarehousesDataSaga);
}
export default rootSaga;
