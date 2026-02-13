import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: ""
}

const ProfilesReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_PROFILES_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_PROFILES_SUCCESS:
            return {
                ...state,
                data: action.payload.data || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_PROFILES_ERROR:
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

export default ProfilesReducer;
