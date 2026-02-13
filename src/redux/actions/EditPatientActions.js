import { EditPatientApi } from "../api/EditPatientApi";
import * as types from "../../actions/ActionTypes";

// Edit Patient Actions
export const EditPatientStart = () => ({
    type: types.EDIT_PATIENT_START
})

export const EditPatientSuccess = (data) => ({
    type: types.EDIT_PATIENT_SUCCESS,
    payload: data
})

export const EditPatientError = (data) => ({
    type: types.EDIT_PATIENT_ERROR,
    payload: data
})

export const EditPatientAction = (memberId, customerId, name, dateOfBirth, gender, relation) => {
    return function(dispatch) {
        dispatch(EditPatientStart())
        return EditPatientApi(memberId, customerId, name, dateOfBirth, gender, relation)
        .then((response) => {
            dispatch(EditPatientSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(EditPatientError(error))
            throw error;
        })
    }
}

export default EditPatientAction;
