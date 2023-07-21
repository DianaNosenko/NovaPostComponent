import ACTION from '../actionTypes'

// cities actions
export const getCitiesDataAction = (data) => ({
    type: ACTION.GET_CITIES_DATA_ACTION,
    data,
});

export const setSelectedCity = (data) => ({
    type: ACTION.SET_SELECTED_CITY,
    data,
});

export const setSelectedCityRef = (data) => ({
    type: ACTION.SET_SELECTED_CITY_REF,
    data,
});

//warehouses actions
export const getWarehousesDataAction = (data) => ({
    type: ACTION.GET_WAREHOUSES_DATA_ACTION,
    data,
});

export const setSelectedWarehouse = (data) => ({
    type: ACTION.SET_SELECTED_WAREHOUSE,
    data,
});

export const setClearWarehousesData = (data) => ({
    type: ACTION.SET_CLEAR_WAREHOUSES_DATA,
    data,
})