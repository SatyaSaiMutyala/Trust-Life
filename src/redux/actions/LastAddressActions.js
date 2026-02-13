import { GetLastAddressApi } from "../api/LastAddressApi";
import * as types from "../../actions/ActionTypes";

// Load Last Address Actions
export const LoadLastAddressStart = () => ({
    type: types.LOAD_LAST_ADDRESS_START
})

export const LoadLastAddressSuccess = (data) => ({
    type: types.LOAD_LAST_ADDRESS_SUCCESS,
    payload: data
})

export const LoadLastAddressError = (data) => ({
    type: types.LOAD_LAST_ADDRESS_ERROR,
    payload: data
})

export const LoadLastAddressAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadLastAddressStart())
        return GetLastAddressApi(customerId)
        .then((response) => {
            dispatch(LoadLastAddressSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadLastAddressError(error))
            throw error;
        })
    }
}

export default LoadLastAddressAction;
