import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const LastAddressReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LAST_ADDRESS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_LAST_ADDRESS_SUCCESS:
            return {
                ...state,
                data: action.payload.result || null,
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_LAST_ADDRESS_ERROR:
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

export default LastAddressReducer;
