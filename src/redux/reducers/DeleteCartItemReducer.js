import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const DeleteCartItemReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.DELETE_CART_ITEM_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.DELETE_CART_ITEM_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "success"
            }
        case types.DELETE_CART_ITEM_ERROR:
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

export default DeleteCartItemReducer;
