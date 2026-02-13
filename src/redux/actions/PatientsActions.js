import { GetPatientsApi, DeletePatientApi } from "../api/PatientsApi";
import * as types from "../../actions/ActionTypes";

// Load Patients Actions
export const LoadPatientsStart = () => ({
    type: types.LOAD_PATIENTS_START
})

export const LoadPatientsSuccess = (data) => ({
    type: types.LOAD_PATIENTS_SUCCESS,
    payload: data
})

export const LoadPatientsError = (data) => ({
    type: types.LOAD_PATIENTS_ERROR,
    payload: data
})

export const LoadPatientsAction = (customerId) => {
    return function(dispatch) {
        dispatch(LoadPatientsStart())
        return GetPatientsApi(customerId)
        .then((response) => {
            dispatch(LoadPatientsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadPatientsError(error))
            throw error;
        })
    }
}

// Delete Patient Actions
export const DeletePatientStart = () => ({
    type: types.DELETE_PATIENT_START
})

export const DeletePatientSuccess = (data) => ({
    type: types.DELETE_PATIENT_SUCCESS,
    payload: data
})

export const DeletePatientError = (data) => ({
    type: types.DELETE_PATIENT_ERROR,
    payload: data
})

export const DeletePatientAction = (customerId, patientId) => {
    return function(dispatch) {
        dispatch(DeletePatientStart())
        return DeletePatientApi(customerId, patientId)
        .then((response) => {
            dispatch(DeletePatientSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(DeletePatientError(error))
            throw error;
        })
    }
}
