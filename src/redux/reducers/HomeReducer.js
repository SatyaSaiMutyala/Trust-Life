import * as types from '../../actions/ActionTypes';

const initialState = {
    data: {
        banners: [],
        services: [],
        symptoms_first: [],
        symptoms_second: [],
        vendors: [],
        labs: [],
        hospitals: [],
        recommended_doctors: [],
        top_rated_doctors: []
    },
    loading: false,
    hasFetched: ""
}

const HomeReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_HOME_DETAILS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_HOME_DETAILS_SUCCESS:
            return {
                ...state,
                data: action.payload.result,
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_HOME_DETAILS_ERROR:
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

export default HomeReducer;
