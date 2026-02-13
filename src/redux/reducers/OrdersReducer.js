import * as types from "../../actions/ActionTypes"

const initialState = {
    completedOrders: {
        data: [],
        loading: false,
        hasFetched: "",
    },
    pendingOrders: {
        data: [],
        loading: false,
        hasFetched: "",
    },
    orderStatus: {
        data: [],
        loading: false,
        hasFetched: "",
    }
}

const OrdersReducer = (state = initialState, action) => {
    switch(action.type) {
        // Completed Orders
        case types.LOAD_COMPLETED_ORDERS_START:
            return {
                ...state,
                completedOrders: {
                    ...state.completedOrders,
                    loading: true
                }
            }

        case types.LOAD_COMPLETED_ORDERS_SUCCESS:
            return {
                ...state,
                completedOrders: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "success",
                }
            }

        case types.LOAD_COMPLETED_ORDERS_ERROR:
            return {
                ...state,
                completedOrders: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "error",
                }
            }

        // Pending Orders
        case types.LOAD_PENDING_ORDERS_START:
            return {
                ...state,
                pendingOrders: {
                    ...state.pendingOrders,
                    loading: true
                }
            }

        case types.LOAD_PENDING_ORDERS_SUCCESS:
            return {
                ...state,
                pendingOrders: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "success",
                }
            }

        case types.LOAD_PENDING_ORDERS_ERROR:
            return {
                ...state,
                pendingOrders: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "error",
                }
            }

        // Order Status
        case types.LOAD_ORDER_STATUS_START:
            return {
                ...state,
                orderStatus: {
                    ...state.orderStatus,
                    loading: true
                }
            }

        case types.LOAD_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                orderStatus: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "success",
                }
            }

        case types.LOAD_ORDER_STATUS_ERROR:
            return {
                ...state,
                orderStatus: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "error",
                }
            }

        default:
            return state;
    }
}

export default OrdersReducer;
