import { CustomerLoginApi, CustomerRegisterApi, CheckPhoneApi } from "../api/CustomerAuthApi";
import * as types from "../../actions/ActionTypes";

// Customer Login Actions
export const CustomerLoginStart = () => ({
    type: types.CUSTOMER_LOGIN_START
})

export const CustomerLoginSuccess = (data) => ({
    type: types.CUSTOMER_LOGIN_SUCCESS,
    payload: data
})

export const CustomerLoginError = (data) => ({
    type: types.CUSTOMER_LOGIN_ERROR,
    payload: data
})

export const CustomerLoginAction = (phoneWithCode, fcmToken, otp) => {
    return async function(dispatch) {
        dispatch(CustomerLoginStart())
        return CustomerLoginApi(phoneWithCode, fcmToken, otp)
        .then((response) => {
            dispatch(CustomerLoginSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(CustomerLoginError(error))
            throw error;
        })
    }
}

// Customer Register Actions
export const CustomerRegisterStart = () => ({
    type: types.CUSTOMER_REGISTER_START
})

export const CustomerRegisterSuccess = (data) => ({
    type: types.CUSTOMER_REGISTER_SUCCESS,
    payload: data
})

export const CustomerRegisterError = (data) => ({
    type: types.CUSTOMER_REGISTER_ERROR,
    payload: data
})

export const CustomerRegisterAction = (data) => {
    return function(dispatch) {
        dispatch(CustomerRegisterStart())
        return CustomerRegisterApi(data)
        .then((response) => {
            dispatch(CustomerRegisterSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(CustomerRegisterError(error))
            throw error;
        })
    }
}

// Check Phone Actions
export const CheckPhoneStart = () => ({
    type: types.CHECK_PHONE_START
})

export const CheckPhoneSuccess = (data) => ({
    type: types.CHECK_PHONE_SUCCESS,
    payload: data
})

export const CheckPhoneError = (data) => ({
    type: types.CHECK_PHONE_ERROR,
    payload: data
})

export const CheckPhoneAction = (phoneWithCode) => {
    return function(dispatch) {
        dispatch(CheckPhoneStart())
        return CheckPhoneApi(phoneWithCode)
        .then((response) => {
            dispatch(CheckPhoneSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(CheckPhoneError(error))
            throw error;
        })
    }
}
