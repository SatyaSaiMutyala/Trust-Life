import { AddToCartApi } from "../api/AddToCartApi";
import * as types from "../../actions/ActionTypes";

// Add To Cart Actions
export const AddToCartStart = () => ({
    type: types.ADD_TO_CART_ITEM_START
})

export const AddToCartSuccess = (data) => ({
    type: types.ADD_TO_CART_ITEM_SUCCESS,
    payload: data
})

export const AddToCartError = (data) => ({
    type: types.ADD_TO_CART_ITEM_ERROR,
    payload: data
})

export const AddToCartAction = (serviceId, customerId, price, serviceType) => {
    return function(dispatch) {
        dispatch(AddToCartStart())
        return AddToCartApi(serviceId, customerId, price, serviceType)
        .then((response) => {
            dispatch(AddToCartSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(AddToCartError(error))
            throw error;
        })
    }
}

export default AddToCartAction;
