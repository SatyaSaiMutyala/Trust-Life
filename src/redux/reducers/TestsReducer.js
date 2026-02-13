import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: ""
}

const TestsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_TESTS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_TESTS_SUCCESS:
            return {
                ...state,
                data: action.payload.data || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_TESTS_ERROR:
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

export default TestsReducer;
