import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const PlaceLabOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.PLACE_LAB_ORDER_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.PLACE_LAB_ORDER_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "success"
            }
        case types.PLACE_LAB_ORDER_ERROR:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "error"
            }
        default:
            return state;
    }
}

export default PlaceLabOrderReducer;
