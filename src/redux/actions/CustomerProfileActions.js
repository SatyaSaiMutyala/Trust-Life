import {
    GetCustomerProfileApi,
    UpdateCustomerProfileApi,
    UploadProfilePictureApi,
    UpdateProfilePictureApi
} from "../api/CustomerProfileApi";
import * as types from "../../actions/ActionTypes";

// Load Customer Profile Actions
export const LoadCustomerProfileStart = () => ({
    type: types.LOAD_CUSTOMER_PROFILE_START
})

export const LoadCustomerProfileSuccess = (data) => ({
    type: types.LOAD_CUSTOMER_PROFILE_SUCCESS,
    payload: data
})

export const LoadCustomerProfileError = (data) => ({
    type: types.LOAD_CUSTOMER_PROFILE_ERROR,
    payload: data
})

export const LoadCustomerProfileAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadCustomerProfileStart())
        return GetCustomerProfileApi(customerId)
        .then((response) => {
            dispatch(LoadCustomerProfileSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadCustomerProfileError(error))
            throw error;
        })
    }
}

// Update Customer Profile Actions
export const UpdateCustomerProfileStart = () => ({
    type: types.UPDATE_CUSTOMER_PROFILE_START
})

export const UpdateCustomerProfileSuccess = (data) => ({
    type: types.UPDATE_CUSTOMER_PROFILE_SUCCESS,
    payload: data
})

export const UpdateCustomerProfileError = (data) => ({
    type: types.UPDATE_CUSTOMER_PROFILE_ERROR,
    payload: data
})

export const UpdateCustomerProfileAction = (profileData) => {
    return function(dispatch) {
        dispatch(UpdateCustomerProfileStart())
        return UpdateCustomerProfileApi(profileData)
        .then((response) => {
            dispatch(UpdateCustomerProfileSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(UpdateCustomerProfileError(error))
            throw error;
        })
    }
}

// Upload Profile Picture Actions
export const UploadProfilePictureStart = () => ({
    type: types.UPLOAD_PROFILE_PICTURE_START
})

export const UploadProfilePictureSuccess = (data) => ({
    type: types.UPLOAD_PROFILE_PICTURE_SUCCESS,
    payload: data
})

export const UploadProfilePictureError = (data) => ({
    type: types.UPLOAD_PROFILE_PICTURE_ERROR,
    payload: data
})

export const UploadProfilePictureAction = (base64Image) => {
    return function(dispatch) {
        dispatch(UploadProfilePictureStart())
        return UploadProfilePictureApi(base64Image)
        .then((response) => {
            dispatch(UploadProfilePictureSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(UploadProfilePictureError(error))
            throw error;
        })
    }
}

// Update Profile Picture URL Actions
export const UpdateProfilePictureStart = () => ({
    type: types.UPDATE_PROFILE_PICTURE_START
})

export const UpdateProfilePictureSuccess = (data) => ({
    type: types.UPDATE_PROFILE_PICTURE_SUCCESS,
    payload: data
})

export const UpdateProfilePictureError = (data) => ({
    type: types.UPDATE_PROFILE_PICTURE_ERROR,
    payload: data
})

export const UpdateProfilePictureAction = (customerId, imageUrl) => {
    return function(dispatch) {
        dispatch(UpdateProfilePictureStart())
        return UpdateProfilePictureApi(customerId, imageUrl)
        .then((response) => {
            dispatch(UpdateProfilePictureSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(UpdateProfilePictureError(error))
            throw error;
        })
    }
}

export default LoadCustomerProfileAction;
