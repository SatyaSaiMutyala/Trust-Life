import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const EditPatientReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.EDIT_PATIENT_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.EDIT_PATIENT_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "success"
            }
        case types.EDIT_PATIENT_ERROR:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "error"
            }
        default:
            return state;
    }
}

export default EditPatientReducer;
