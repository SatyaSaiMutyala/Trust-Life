import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const LabDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LAB_DETAILS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_LAB_DETAILS_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_LAB_DETAILS_ERROR:
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

export default LabDetailsReducer;
