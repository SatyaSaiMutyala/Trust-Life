import * as types from '../../actions/ActionTypes';

const initialState = {
    data: {
        cart_items: [],
        total_price: 0
    },
    loading: false,
    hasFetched: ""
}

const LabCartItemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LAB_CART_ITEMS_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_LAB_CART_ITEMS_SUCCESS:
            return {
                ...state,
                data: {
                    cart_items: action.payload.cart_items || [],
                    total_price: action.payload.total_price || 0
                },
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_LAB_CART_ITEMS_ERROR:
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

export default LabCartItemsReducer;
