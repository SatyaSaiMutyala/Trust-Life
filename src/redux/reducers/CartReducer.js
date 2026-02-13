import * as types from "../../actions/ActionTypes"

const initialState = {
    data: [],
    loading: false,
    hasFetched: "",
}

const CartReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.LOAD_CART_START:
            return {
                ...state,
                loading: true
            }

        case types.LOAD_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                hasFetched: "success",
            }

        case types.LOAD_CART_ERROR:
            return {
                ...state,
                loading: false,
                data: action.payload,
                hasFetched: "error",
            }

        default:
            return state;
    }
}

export default CartReducer;
