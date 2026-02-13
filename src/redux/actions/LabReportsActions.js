import { GetLabReportsApi } from "../api/LabReportsApi";
import * as types from "../../actions/ActionTypes";

export const LoadLabReportsStart = () => ({
    type: types.LOAD_LAB_REPORTS_START
})

export const LoadLabReportsSuccess = (data) => ({
    type: types.LOAD_LAB_REPORTS_SUCCESS,
    payload: data
})

export const LoadLabReportsError = (data) => ({
    type: types.LOAD_LAB_REPORTS_ERROR,
    payload: data
})

const LoadLabReportsAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadLabReportsStart())
        GetLabReportsApi(customerId)
        .then((response) => {
            dispatch(LoadLabReportsSuccess(response))
        })
        .catch((error) => {
            dispatch(LoadLabReportsError(error))
        })
    }
}

export default LoadLabReportsAction;
