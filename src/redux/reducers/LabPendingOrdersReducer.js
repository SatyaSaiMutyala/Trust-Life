import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: ""
}

const LabPendingOrdersReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LAB_PENDING_ORDERS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_LAB_PENDING_ORDERS_SUCCESS:
            return {
                ...state,
                data: action.payload.result || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_LAB_PENDING_ORDERS_ERROR:
            return {
                ...state,
                data: [],
                loading: false,
                hasFetched: "error"
            }
        default:
            return state;
    }
}

export default LabPendingOrdersReducer;
