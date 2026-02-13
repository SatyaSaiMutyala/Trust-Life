import API from "./Api";

const api = new API();

export const GetLastAddressApi = (customerId) => {
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
