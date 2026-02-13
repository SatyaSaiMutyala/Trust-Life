import API from "./Api";

const api = new API();

export const GetAllAddressesApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/all_addresses', {
                customer_id: customerId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const SetActiveAddressApi = (customerId, addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/last_active_address', {
                customer_id: customerId,
                address_id: addressId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const AddAddressApi = (addressData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/add_address', addressData)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const GetLastActiveAddressApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/get_last_active_address', {
                customer_id: customerId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
