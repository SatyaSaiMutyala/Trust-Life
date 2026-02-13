import { ProfilesApi } from "../api/ProfilesApi";
import * as types from "../../actions/ActionTypes";

// Profiles Actions
export const LoadProfilesStart = () => ({
    type: types.LOAD_PROFILES_START
})

export const LoadProfilesSuccess = (data) => ({
    type: types.LOAD_PROFILES_SUCCESS,
    payload: data
})

export const LoadProfilesError = (data) => ({
    type: types.LOAD_PROFILES_ERROR,
    payload: data
})

export const LoadProfilesAction = (type) => {
    return function(dispatch) {
        dispatch(LoadProfilesStart())
        return ProfilesApi(type)
        .then((response) => {
            dispatch(LoadProfilesSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadProfilesError(error))
            throw error;
        })
    }
}

export default LoadProfilesAction;
