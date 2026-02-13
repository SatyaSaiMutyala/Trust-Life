import { DeleteCartItemApi } from "../api/DeleteCartItemApi";
import * as types from "../../actions/ActionTypes";

// Delete Cart Item Actions
export const DeleteCartItemStart = () => ({
    type: types.DELETE_CART_ITEM_START
})

export const DeleteCartItemSuccess = (data) => ({
    type: types.DELETE_CART_ITEM_SUCCESS,
    payload: data
})

export const DeleteCartItemError = (data) => ({
    type: types.DELETE_CART_ITEM_ERROR,
    payload: data
})

export const DeleteCartItemAction = (customerId, cartId) => {
    return function(dispatch) {
        dispatch(DeleteCartItemStart())
        return DeleteCartItemApi(customerId, cartId)
        .then((response) => {
            dispatch(DeleteCartItemSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(DeleteCartItemError(error))
            throw error;
        })
    }
}

export default DeleteCartItemAction;
