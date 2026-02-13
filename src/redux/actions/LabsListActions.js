import { GetLabsListApi } from "../api/LabsListApi";
import * as types from "../../actions/ActionTypes";

// Load Labs List Actions
export const LoadLabsListStart = () => ({
    type: types.LOAD_LABS_LIST_START
})

export const LoadLabsListSuccess = (data) => ({
    type: types.LOAD_LABS_LIST_SUCCESS,
    payload: data
})

export const LoadLabsListError = (data) => ({
    type: types.LOAD_LABS_LIST_ERROR,
    payload: data
})

export const LoadLabsListAction = (lat, lng, search = "") => {
    return function(dispatch) {
        dispatch(LoadLabsListStart())
        return GetLabsListApi(lat, lng, search)
        .then((response) => {
            dispatch(LoadLabsListSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadLabsListError(error))
            throw error;
        })
    }
}

export default LoadLabsListAction;
