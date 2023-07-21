import ACTION from "../actionTypes";

const initialState = {
  citiesData: [],
  warehousesData: [],
  isFetching: true,
  error: null,
  selectedCity: "",
  selectedCityRef: "",
  selectedWarehouse: "",
};
function novaPostReducers(state = initialState, action) {
  switch (action.type) {
    // REQUEST
    case ACTION.NOVA_POST_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }
    //GET_CITIES_DATA
    case ACTION.GET_CITIES_DATA_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        citiesData: [...state.citiesData, ...action.data],
      };
    }
    case ACTION.GET_CITIES_DATA_SEARCH_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        citiesData: [...action.data],
      };
    }
    //GET_WAREHOUSES_DATA
    case ACTION.GET_WAREHOUSES_DATA_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        warehousesData: [...state.warehousesData, ...action.data],
      };
    }
    case ACTION.SET_CLEAR_CITIES_DATA: {
      return {
        ...state,
        citiesData: [],
      };
    }
    case ACTION.SET_CLEAR_WAREHOUSES_DATA: {
      return {
        ...state,
        warehousesData: [],
      };
    }
    // ERROR
    case ACTION.NOVA_POST_ERROR: {
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    }
    // SET STATES
    case ACTION.SET_SELECTED_CITY: {
      return {
        ...state,
        selectedCity: action.data,
      };
    }
    case ACTION.SET_SELECTED_CITY_REF: {
      return {
        ...state,
        selectedCityRef: action.data,
      };
    }
    case ACTION.SET_SELECTED_WAREHOUSE: {
      return {
        ...state,
        selectedWarehouse: action.data,
      };
    }
    default:
      return state;
  }
}

export default novaPostReducers;
