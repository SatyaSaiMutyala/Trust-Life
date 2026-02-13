import { GetLabPendingOrdersApi } from "../api/LabPendingOrdersApi";
import * as types from "../../actions/ActionTypes";

// Load Lab Pending Orders Actions
export const LoadLabPendingOrdersStart = () => ({
    type: types.LOAD_LAB_PENDING_ORDERS_START
})

export const LoadLabPendingOrdersSuccess = (data) => ({
    type: types.LOAD_LAB_PENDING_ORDERS_SUCCESS,
    payload: data
})

export const LoadLabPendingOrdersError = (data) => ({
    type: types.LOAD_LAB_PENDING_ORDERS_ERROR,
    payload: data
})

export const LoadLabPendingOrdersAction = (customerId, filter = 'all', perPage = 10, page = 1) => {
    return function(dispatch) {
        dispatch(LoadLabPendingOrdersStart())
        return GetLabPendingOrdersApi(customerId, filter, perPage, page)
        .then((response) => {
            dispatch(LoadLabPendingOrdersSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadLabPendingOrdersError(error))
            throw error;
        })
    }
}

export default LoadLabPendingOrdersAction;
