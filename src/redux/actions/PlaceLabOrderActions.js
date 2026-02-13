import { PlaceLabOrderApi } from "../api/PlaceLabOrderApi";
import * as types from "../../actions/ActionTypes";

// Place Lab Order Actions
export const PlaceLabOrderStart = () => ({
    type: types.PLACE_LAB_ORDER_START
})

export const PlaceLabOrderSuccess = (data) => ({
    type: types.PLACE_LAB_ORDER_SUCCESS,
    payload: data
})

export const PlaceLabOrderError = (data) => ({
    type: types.PLACE_LAB_ORDER_ERROR,
    payload: data
})

export const PlaceLabOrderAction = (orderData) => {
    return function(dispatch) {
        dispatch(PlaceLabOrderStart())
        return PlaceLabOrderApi(orderData)
        .then((response) => {
            dispatch(PlaceLabOrderSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(PlaceLabOrderError(error))
            throw error;
        })
    }
}

export default PlaceLabOrderAction;
