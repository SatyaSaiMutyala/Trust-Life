import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: ""
}

const NotificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_NOTIFICATIONS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                data: action.payload.result || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_NOTIFICATIONS_ERROR:
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

export default NotificationsReducer;
