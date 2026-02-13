import { GetAllAddressesApi, SetActiveAddressApi, AddAddressApi, GetLastActiveAddressApi } from "../api/AllAddressApi";
import * as types from "../../actions/ActionTypes";

// Load All Addresses Actions
export const LoadAllAddressesStart = () => ({
    type: types.LOAD_ALL_ADDRESSES_START
})

export const LoadAllAddressesSuccess = (data) => ({
    type: types.LOAD_ALL_ADDRESSES_SUCCESS,
    payload: data
})

export const LoadAllAddressesError = (data) => ({
    type: types.LOAD_ALL_ADDRESSES_ERROR,
    payload: data
})

export const LoadAllAddressesAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadAllAddressesStart())
        return GetAllAddressesApi(customerId)
        .then((response) => {
            dispatch(LoadAllAddressesSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadAllAddressesError(error))
            throw error;
        })
    }
}

// Set Active Address Actions
export const SetActiveAddressStart = () => ({
    type: types.SET_ACTIVE_ADDRESS_START
})

export const SetActiveAddressSuccess = (data) => ({
    type: types.SET_ACTIVE_ADDRESS_SUCCESS,
    payload: data
})

export const SetActiveAddressError = (data) => ({
    type: types.SET_ACTIVE_ADDRESS_ERROR,
    payload: data
})

export const SetActiveAddressAction = (customerId, addressId) => {
    return function(dispatch) {
        dispatch(SetActiveAddressStart())
        return SetActiveAddressApi(customerId, addressId)
        .then((response) => {
            dispatch(SetActiveAddressSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(SetActiveAddressError(error))
            throw error;
        })
    }
}

// Add Address Actions
export const AddAddressStart = () => ({
    type: types.ADD_ADDRESS_START
})

export const AddAddressSuccess = (data) => ({
    type: types.ADD_ADDRESS_SUCCESS,
    payload: data
})

export const AddAddressError = (data) => ({
    type: types.ADD_ADDRESS_ERROR,
    payload: data
})

export const AddAddressAction = (addressData) => {
    return function(dispatch) {
        dispatch(AddAddressStart())
        return AddAddressApi(addressData)
        .then((response) => {
            dispatch(AddAddressSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(AddAddressError(error))
            throw error;
        })
    }
}

// Get Last Active Address Actions
export const GetLastActiveAddressStart = () => ({
    type: types.GET_LAST_ACTIVE_ADDRESS_START
})

export const GetLastActiveAddressSuccess = (data) => ({
    type: types.GET_LAST_ACTIVE_ADDRESS_SUCCESS,
    payload: data
})

export const GetLastActiveAddressError = (data) => ({
    type: types.GET_LAST_ACTIVE_ADDRESS_ERROR,
    payload: data
})

export const GetLastActiveAddressAction = (customerId) => {
    return function(dispatch) {
        dispatch(GetLastActiveAddressStart())
        return GetLastActiveAddressApi(customerId)
        .then((response) => {
            dispatch(GetLastActiveAddressSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(GetLastActiveAddressError(error))
            throw error;
        })
    }
}

export default LoadAllAddressesAction;
