import { ApplyCouponApi } from "../api/ApplyCouponApi";
import * as types from "../../actions/ActionTypes";

// Apply Coupon Actions
export const ApplyCouponStart = () => ({
    type: types.APPLY_COUPON_START
})

export const ApplyCouponSuccess = (data) => ({
    type: types.APPLY_COUPON_SUCCESS,
    payload: data
})

export const ApplyCouponError = (data) => ({
    type: types.APPLY_COUPON_ERROR,
    payload: data
})

export const ApplyCouponAction = (couponCode, userId) => {
    return function(dispatch) {
        dispatch(ApplyCouponStart())
        return ApplyCouponApi(couponCode, userId)
        .then((response) => {
            dispatch(ApplyCouponSuccess(response))
            return response;
        })
        .catch((error) => {
            dispatch(ApplyCouponError(error))
            throw error;
        })
    }
}

export default ApplyCouponAction;
