import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const ApplyCouponReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.APPLY_COUPON_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.APPLY_COUPON_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "success"
            }
        case types.APPLY_COUPON_ERROR:
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

export default ApplyCouponReducer;
