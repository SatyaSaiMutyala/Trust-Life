import * as types from "../../actions/ActionTypes";

const initialState = {
    data: null,
    loading: false,
    error: null,
    status: null, // 'idle' | 'loading' | 'success' | 'error'
};

const UploadReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.UPLOAD_REPORT_START:
            return {
                ...state,
                loading: true,
                error: null,
                status: 'loading',
            };

        case types.UPLOAD_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: null,
                status: 'success',
            };

        case types.UPLOAD_REPORT_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: 'error',
            };

        case types.UPLOAD_REPORT_RESET:
            return initialState;

        default:
            return state;
    }
};

export default UploadReportReducer;
