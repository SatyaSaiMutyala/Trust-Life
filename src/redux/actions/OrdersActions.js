import { GetCompletedOrdersApi, GetPendingOrdersApi, GetOrderStatusApi } from "../api/OrdersApi";
import * as types from "../../actions/ActionTypes";

// Completed Orders Actions
export const LoadCompletedOrdersStart = () => ({
    type: types.LOAD_COMPLETED_ORDERS_START
})

export const LoadCompletedOrdersSuccess = (data) => ({
    type: types.LOAD_COMPLETED_ORDERS_SUCCESS,
    payload: data
})

export const LoadCompletedOrdersError = (data) => ({
    type: types.LOAD_COMPLETED_ORDERS_ERROR,
    payload: data
})

export const LoadCompletedOrdersAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadCompletedOrdersStart())
        GetCompletedOrdersApi(customerId)
        .then((response) => {
            dispatch(LoadCompletedOrdersSuccess(response))
        })
        .catch((error) => {
            dispatch(LoadCompletedOrdersError(error))
        })
    }
}

// Pending Orders Actions
export const LoadPendingOrdersStart = () => ({
    type: types.LOAD_PENDING_ORDERS_START
})

export const LoadPendingOrdersSuccess = (data) => ({
    type: types.LOAD_PENDING_ORDERS_SUCCESS,
    payload: data
})

export const LoadPendingOrdersError = (data) => ({
    type: types.LOAD_PENDING_ORDERS_ERROR,
    payload: data
})

export const LoadPendingOrdersAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadPendingOrdersStart())
        GetPendingOrdersApi(customerId)
        .then((response) => {
            dispatch(LoadPendingOrdersSuccess(response))
        })
        .catch((error) => {
            dispatch(LoadPendingOrdersError(error))
        })
    }
}

// Order Status Actions
export const LoadOrderStatusStart = () => ({
    type: types.LOAD_ORDER_STATUS_START
})

export const LoadOrderStatusSuccess = (data) => ({
    type: types.LOAD_ORDER_STATUS_SUCCESS,
    payload: data
})

export const LoadOrderStatusError = (data) => ({
    type: types.LOAD_ORDER_STATUS_ERROR,
    payload: data
})

export const LoadOrderStatusAction = () => {
    return function(dispatch) {
        dispatch(LoadOrderStatusStart())
        GetOrderStatusApi()
        .then((response) => {
            dispatch(LoadOrderStatusSuccess(response))
        })
        .catch((error) => {
            dispatch(LoadOrderStatusError(error))
        })
    }
}
