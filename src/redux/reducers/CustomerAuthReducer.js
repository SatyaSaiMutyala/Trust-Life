import * as types from "../../actions/ActionTypes"

const initialState = {
    login: {
        data: null,
        loading: false,
        hasFetched: "",
    },
    register: {
        data: null,
        loading: false,
        hasFetched: "",
    },
    checkPhone: {
        data: null,
        loading: false,
        hasFetched: "",
    }
}

const CustomerAuthReducer = (state = initialState, action) => {
    switch(action.type) {
        // Login
        case types.CUSTOMER_LOGIN_START:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading: true
                }
            }

        case types.CUSTOMER_LOGIN_SUCCESS:
            return {
                ...state,
                login: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "success",
                }
            }

        case types.CUSTOMER_LOGIN_ERROR:
            return {
                ...state,
                login: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "error",
                }
            }

        // Register
        case types.CUSTOMER_REGISTER_START:
            return {
                ...state,
                register: {
                    ...state.register,
                    loading: true
                }
            }

        case types.CUSTOMER_REGISTER_SUCCESS:
            return {
                ...state,
                register: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "success",
                }
            }

        case types.CUSTOMER_REGISTER_ERROR:
            return {
                ...state,
                register: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "error",
                }
            }

        // Check Phone
        case types.CHECK_PHONE_START:
            return {
                ...state,
                checkPhone: {
                    ...state.checkPhone,
                    loading: true
                }
            }

        case types.CHECK_PHONE_SUCCESS:
            return {
                ...state,
                checkPhone: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "success",
                }
            }

        case types.CHECK_PHONE_ERROR:
            return {
                ...state,
                checkPhone: {
                    loading: false,
                    data: action.payload,
                    hasFetched: "error",
                }
            }

        default:
            return state;
    }
}

export default CustomerAuthReducer;
