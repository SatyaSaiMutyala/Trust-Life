import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: "",
    updating: false,
    updateStatus: "",
    uploadingPicture: false,
    uploadPictureStatus: ""
}

const CustomerProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        // Load Profile
        case types.LOAD_CUSTOMER_PROFILE_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_CUSTOMER_PROFILE_SUCCESS:
            return {
                ...state,
                data: action.payload.result || null,
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_CUSTOMER_PROFILE_ERROR:
            return {
                ...state,
                data: null,
                loading: false,
                hasFetched: "error"
            }

        // Update Profile
        case types.UPDATE_CUSTOMER_PROFILE_START:
            return {
                ...state,
                updating: true,
                updateStatus: ""
            }
        case types.UPDATE_CUSTOMER_PROFILE_SUCCESS:
            return {
                ...state,
                data: action.payload.result || state.data,
                updating: false,
                updateStatus: "success"
            }
        case types.UPDATE_CUSTOMER_PROFILE_ERROR:
            return {
                ...state,
                updating: false,
                updateStatus: "error"
            }

        // Upload Profile Picture
        case types.UPLOAD_PROFILE_PICTURE_START:
            return {
                ...state,
                uploadingPicture: true,
                uploadPictureStatus: ""
            }
        case types.UPLOAD_PROFILE_PICTURE_SUCCESS:
            return {
                ...state,
                uploadingPicture: false,
                uploadPictureStatus: "success"
            }
        case types.UPLOAD_PROFILE_PICTURE_ERROR:
            return {
                ...state,
                uploadingPicture: false,
                uploadPictureStatus: "error"
            }

        // Update Profile Picture URL
        case types.UPDATE_PROFILE_PICTURE_START:
            return {
                ...state,
                uploadingPicture: true,
                uploadPictureStatus: ""
            }
        case types.UPDATE_PROFILE_PICTURE_SUCCESS:
            return {
                ...state,
                uploadingPicture: false,
                uploadPictureStatus: "success"
            }
        case types.UPDATE_PROFILE_PICTURE_ERROR:
            return {
                ...state,
                uploadingPicture: false,
                uploadPictureStatus: "error"
            }

        default:
            return state;
    }
}

export default CustomerProfileReducer;
