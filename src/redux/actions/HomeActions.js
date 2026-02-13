import { GetHomeDetailsApi } from "../api/HomeApi";
import * as types from "../../actions/ActionTypes";

// Load Home Details Actions
export const LoadHomeDetailsStart = () => ({
    type: types.LOAD_HOME_DETAILS_START
})

export const LoadHomeDetailsSuccess = (data) => ({
    type: types.LOAD_HOME_DETAILS_SUCCESS,
    payload: data
})

export const LoadHomeDetailsError = (data) => ({
    type: types.LOAD_HOME_DETAILS_ERROR,
    payload: data
})

export const LoadHomeDetailsAction = (lat, lng) => {
    return function(dispatch) {
        dispatch(LoadHomeDetailsStart())
        return GetHomeDetailsApi(lat, lng)
        .then((response) => {
            dispatch(LoadHomeDetailsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadHomeDetailsError(error))
            throw error;
        })
    }
}

export default LoadHomeDetailsAction;
