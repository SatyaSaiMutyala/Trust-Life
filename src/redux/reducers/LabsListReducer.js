import * as types from '../../actions/ActionTypes';

const initialState = {
    data: {
        nearest: [],
        recommended: []
    },
    loading: false,
    hasFetched: ""
}

const LabsListReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LABS_LIST_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_LABS_LIST_SUCCESS:
            return {
                ...state,
                data: {
                    nearest: action.payload.result?.nearest || [],
                    recommended: action.payload.result?.recommended || []
                },
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_LABS_LIST_ERROR:
            return {
                ...state,
                data: {
                    nearest: [],
                    recommended: []
                },
                loading: false,
                hasFetched: "error"
            }
        default:
            return state;
    }
}

export default LabsListReducer;
