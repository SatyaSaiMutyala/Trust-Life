import { UploadReportApi } from "../api/UploadReportApi";
import * as types from "../../actions/ActionTypes";

export const UploadReportStart = () => ({
    type: types.UPLOAD_REPORT_START
});

export const UploadReportSuccess = (data) => ({
    type: types.UPLOAD_REPORT_SUCCESS,
    payload: data
});

export const UploadReportError = (data) => ({
    type: types.UPLOAD_REPORT_ERROR,
    payload: data
});

export const UploadReportReset = () => ({
    type: types.UPLOAD_REPORT_RESET
});

const UploadReportAction = (data) => {
    return function(dispatch) {
        dispatch(UploadReportStart());
        UploadReportApi(data)
            .then((response) => {
                if (response.status === 1) {
                    dispatch(UploadReportSuccess(response));
                } else {
                    dispatch(UploadReportError(response.message || 'Failed to upload report'));
                }
            })
            .catch((error) => {
                dispatch(UploadReportError(error.message || 'Something went wrong'));
            });
    };
};

export default UploadReportAction;
