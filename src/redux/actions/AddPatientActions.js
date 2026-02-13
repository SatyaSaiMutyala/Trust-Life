import { AddPatientApi } from "../api/AddPatientApi";
import * as types from "../../actions/ActionTypes";

// Add Patient Actions
export const AddPatientStart = () => ({
    type: types.ADD_PATIENT_START
})

export const AddPatientSuccess = (data) => ({
    type: types.ADD_PATIENT_SUCCESS,
    payload: data
})

export const AddPatientError = (data) => ({
    type: types.ADD_PATIENT_ERROR,
    payload: data
})

export const AddPatientAction = (customerId, name, dateOfBirth, gender, relation) => {
    return function(dispatch) {
        dispatch(AddPatientStart())
        return AddPatientApi(customerId, name, dateOfBirth, gender, relation)
        .then((response) => {
            dispatch(AddPatientSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(AddPatientError(error))
            throw error;
        })
    }
}

export default AddPatientAction;
