import { GetLabOrderDetailsApi } from "../api/LabOrderDetailsApi";
import * as types from "../../actions/ActionTypes";

// Load Lab Order Details Actions
export const LoadLabOrderDetailsStart = () => ({
    type: types.LOAD_LAB_ORDER_DETAILS_START
})

export const LoadLabOrderDetailsSuccess = (data) => ({
    type: types.LOAD_LAB_ORDER_DETAILS_SUCCESS,
    payload: data
})

export const LoadLabOrderDetailsError = (data) => ({
    type: types.LOAD_LAB_ORDER_DETAILS_ERROR,
    payload: data
})

export const LoadLabOrderDetailsAction = (orderId) => {
    return function(dispatch) {
        dispatch(LoadLabOrderDetailsStart())
        return GetLabOrderDetailsApi(orderId)
        .then((response) => {
            dispatch(LoadLabOrderDetailsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadLabOrderDetailsError(error))
            throw error;
        })
    }
}

export default LoadLabOrderDetailsAction;
