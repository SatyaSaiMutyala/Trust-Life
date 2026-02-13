import { PackagesApi } from "../api/PackagesApi";
import * as types from "../../actions/ActionTypes";

// Packages Actions
export const LoadPackagesStart = () => ({
    type: types.LOAD_PACKAGES_START
})

export const LoadPackagesSuccess = (data) => ({
    type: types.LOAD_PACKAGES_SUCCESS,
    payload: data
})

export const LoadPackagesError = (data) => ({
    type: types.LOAD_PACKAGES_ERROR,
    payload: data
})

export const LoadPackagesAction = (testType) => {
    return function(dispatch) {
        dispatch(LoadPackagesStart())
        return PackagesApi(testType)
        .then((response) => {
            dispatch(LoadPackagesSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadPackagesError(error))
            throw error;
        })
    }
}

export default LoadPackagesAction;
