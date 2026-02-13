import { GetRelevanceDataApi } from "../api/RelevanceDataApi";
import * as types from "../../actions/ActionTypes";

// Load Relevance Data Actions
export const LoadRelevanceDataStart = () => ({
    type: types.LOAD_RELEVANCE_DATA_START
})

export const LoadRelevanceDataSuccess = (data) => ({
    type: types.LOAD_RELEVANCE_DATA_SUCCESS,
    payload: data
})

export const LoadRelevanceDataError = (data) => ({
    type: types.LOAD_RELEVANCE_DATA_ERROR,
    payload: data
})

export const LoadRelevanceDataAction = (endpoint, page) => {
    return function(dispatch) {
        dispatch(LoadRelevanceDataStart())
        return GetRelevanceDataApi(endpoint, page)
        .then((response) => {
            dispatch(LoadRelevanceDataSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadRelevanceDataError(error))
            throw error;
        })
    }
}

export default LoadRelevanceDataAction;
