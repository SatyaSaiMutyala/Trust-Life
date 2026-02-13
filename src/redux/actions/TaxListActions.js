import { GetTaxListApi } from "../api/TaxListApi";
import * as types from "../../actions/ActionTypes";

// Load Tax List Actions
export const LoadTaxListStart = () => ({
    type: types.LOAD_TAX_LIST_START
})

export const LoadTaxListSuccess = (data) => ({
    type: types.LOAD_TAX_LIST_SUCCESS,
    payload: data
})

export const LoadTaxListError = (data) => ({
    type: types.LOAD_TAX_LIST_ERROR,
    payload: data
})

export const LoadTaxListAction = (serviceId) => {
    return function(dispatch) {
        dispatch(LoadTaxListStart())
        return GetTaxListApi(serviceId)
        .then((response) => {
            dispatch(LoadTaxListSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(LoadTaxListError(error))
            throw error;
        })
    }
}

export default LoadTaxListAction;
