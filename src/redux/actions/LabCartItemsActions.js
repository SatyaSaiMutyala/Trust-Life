import { GetLabCartItemsApi } from "../api/LabCartItemsApi";
import * as types from "../../actions/ActionTypes";

// Load Lab Cart Items Actions
export const LoadLabCartItemsStart = () => ({
    type: types.LOAD_LAB_CART_ITEMS_START
})

export const LoadLabCartItemsSuccess = (data) => ({
    type: types.LOAD_LAB_CART_ITEMS_SUCCESS,
    payload: data
})

export const LoadLabCartItemsError = (data) => ({
    type: types.LOAD_LAB_CART_ITEMS_ERROR,
    payload: data
})

export const LoadLabCartItemsAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadLabCartItemsStart())
        return GetLabCartItemsApi(customerId)
        .then((response) => {
            dispatch(LoadLabCartItemsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadLabCartItemsError(error))
            throw error;
        })
    }
}

export default LoadLabCartItemsAction;
