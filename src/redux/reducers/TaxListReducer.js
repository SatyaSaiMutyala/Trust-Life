import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: ""
}

const TaxListReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_TAX_LIST_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_TAX_LIST_SUCCESS:
            return {
                ...state,
                data: action.payload.result || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_TAX_LIST_ERROR:
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

export default TaxListReducer;
