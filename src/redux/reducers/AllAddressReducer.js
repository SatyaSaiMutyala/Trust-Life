import * as types from '../../actions/ActionTypes';

const initialState = {
    data: [],
    loading: false,
    hasFetched: "",
    settingActive: false,
    setActiveStatus: "",
    addingAddress: false,
    addAddressStatus: "",
    lastActiveAddress: null,
    loadingLastActive: false,
    lastActiveStatus: ""
}

const AllAddressReducer = (state = initialState, action) => {
    switch (action.type) {
        // Load All Addresses
        case types.LOAD_ALL_ADDRESSES_START:
            return {
                ...state,
                loading: true,
                hasFetched: ""
            }
        case types.LOAD_ALL_ADDRESSES_SUCCESS:
            return {
                ...state,
                data: action.payload.result || [],
                loading: false,
                hasFetched: "success"
            }
        case types.LOAD_ALL_ADDRESSES_ERROR:
            return {
                ...state,
                data: [],
                loading: false,
                hasFetched: "error"
            }

        // Set Active Address
        case types.SET_ACTIVE_ADDRESS_START:
            return {
                ...state,
                settingActive: true,
                setActiveStatus: ""
            }
        case types.SET_ACTIVE_ADDRESS_SUCCESS:
            return {
                ...state,
                settingActive: false,
                setActiveStatus: "success"
            }
        case types.SET_ACTIVE_ADDRESS_ERROR:
            return {
                ...state,
                settingActive: false,
                setActiveStatus: "error"
            }

        // Add Address
        case types.ADD_ADDRESS_START:
            return {
                ...state,
                addingAddress: true,
                addAddressStatus: ""
            }
        case types.ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                addingAddress: false,
                addAddressStatus: "success"
            }
        case types.ADD_ADDRESS_ERROR:
            return {
                ...state,
                addingAddress: false,
                addAddressStatus: "error"
            }

        // Get Last Active Address
        case types.GET_LAST_ACTIVE_ADDRESS_START:
            return {
                ...state,
                loadingLastActive: true,
                lastActiveStatus: ""
            }
        case types.GET_LAST_ACTIVE_ADDRESS_SUCCESS:
            return {
                ...state,
                lastActiveAddress: action.payload.result || null,
                loadingLastActive: false,
                lastActiveStatus: "success"
            }
        case types.GET_LAST_ACTIVE_ADDRESS_ERROR:
            return {
                ...state,
                lastActiveAddress: null,
                loadingLastActive: false,
                lastActiveStatus: "error"
            }

        default:
            return state;
    }
}

export default AllAddressReducer;
