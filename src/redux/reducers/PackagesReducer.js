import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: ""
}

const PackagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_PACKAGES_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_PACKAGES_SUCCESS:
            return {
                ...state,
                data: action.payload.data || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_PACKAGES_ERROR:
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

export default PackagesReducer;
