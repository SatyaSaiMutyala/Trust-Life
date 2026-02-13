import { GetNotificationsApi } from "../api/NotificationsApi";
import * as types from "../../actions/ActionTypes";

// Load Notifications Actions
export const LoadNotificationsStart = () => ({
    type: types.LOAD_NOTIFICATIONS_START
})

export const LoadNotificationsSuccess = (data) => ({
    type: types.LOAD_NOTIFICATIONS_SUCCESS,
    payload: data
})

export const LoadNotificationsError = (data) => ({
    type: types.LOAD_NOTIFICATIONS_ERROR,
    payload: data
})

export const LoadNotificationsAction = (appModule) => {
    return async function(dispatch) {
        dispatch(LoadNotificationsStart())
        return GetNotificationsApi(appModule)
        .then((response) => {
            dispatch(LoadNotificationsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadNotificationsError(error))
            throw error;
        })
    }
}

export default LoadNotificationsAction;
