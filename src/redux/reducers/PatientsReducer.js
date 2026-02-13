import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: "",
    deleteLoading: false,
    deleteHasFetched: ""
}

const PatientsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Load Patients
        case types.LOAD_PATIENTS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_PATIENTS_SUCCESS:
            return {
                ...state,
                data: action.payload.patients || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_PATIENTS_ERROR:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "error"
            }

        // Delete Patient
        case types.DELETE_PATIENT_START:
            return {
                ...state,
                deleteLoading: true,
                deleteHasFetched: ""
            }
        case types.DELETE_PATIENT_SUCCESS:
            return {
                ...state,
                deleteLoading: false,
                deleteHasFetched: "success"
            }
        case types.DELETE_PATIENT_ERROR:
            return {
                ...state,
                deleteLoading: false,
                deleteHasFetched: "error"
            }

        default:
            return state;
    }
}

export default PatientsReducer;
