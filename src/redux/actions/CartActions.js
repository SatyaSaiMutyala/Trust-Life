import { GetCartApi } from "../api/CartApi";
import * as types from "../../actions/ActionTypes";

export const LoadCartStart = () => ({
    type: types.LOAD_CART_START
})

export const LoadCartSuccess = (data) => ({
    type: types.LOAD_CART_SUCCESS,
    payload: data
})

export const LoadCartError = (data) => ({
    type: types.LOAD_CART_ERROR,
    payload: data
})

const LoadCartAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadCartStart())
        GetCartApi(customerId)
        .then((response) => {
            dispatch(LoadCartSuccess(response))
        })
        .catch((error) => {
            dispatch(LoadCartError(error))
        })
    }
}

export default LoadCartAction;
