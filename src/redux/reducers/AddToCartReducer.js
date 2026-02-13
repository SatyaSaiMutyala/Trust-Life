import * as types from '../../actions/ActionTypes';

const initialState = {
    data: null,
    loading: false,
    hasFetched: ""
}

const AddToCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ADD_TO_CART_ITEM_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.ADD_TO_CART_ITEM_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                hasFetched: "success"
            }
        case types.ADD_TO_CART_ITEM_ERROR:
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

export default AddToCartReducer;
