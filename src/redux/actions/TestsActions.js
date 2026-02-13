import { TestsApi } from "../api/TestsApi";
import * as types from "../../actions/ActionTypes";

// Tests Actions
export const LoadTestsStart = () => ({
    type: types.LOAD_TESTS_START
})

export const LoadTestsSuccess = (data) => ({
    type: types.LOAD_TESTS_SUCCESS,
    payload: data
})

export const LoadTestsError = (data) => ({
    type: types.LOAD_TESTS_ERROR,
    payload: data
})

export const LoadTestsAction = () => {
    return function(dispatch) {
        dispatch(LoadTestsStart())
        return TestsApi()
        .then((response) => {
            dispatch(LoadTestsSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadTestsError(error))
            throw error;
        })
    }
}

export default LoadTestsAction;
