import { LabDetailsApi } from "../api/LabDetailsApi";
import * as types from "../../actions/ActionTypes";

// Lab Details Actions
export const LoadLabDetailsStart = () => ({
    type: types.LOAD_LAB_DETAILS_START
})

export const LoadLabDetailsSuccess = (data) => ({
    type: types.LOAD_LAB_DETAILS_SUCCESS,
    payload: data
})

export const LoadLabDetailsError = (data) => ({
    type: types.LOAD_LAB_DETAILS_ERROR,
    payload: data
})

export const LoadLabDetailsAction = (labId) => {
    return function(dispatch) {
        dispatch(LoadLabDetailsStart())
        return LabDetailsApi(labId)
        .then((response) => {
            dispatch(LoadLabDetailsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadLabDetailsError(error))
            throw error;
        })
    }
}

export default LoadLabDetailsAction;
