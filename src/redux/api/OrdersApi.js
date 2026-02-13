import API from "./Api";

const api = new API();

export const GetCompletedOrdersApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.get(`customer/get-orders/${customerId}`)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const GetPendingOrdersApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.get(`customer/get-pending-orders/${customerId}`)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const GetOrderStatusApi = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.get('customer/status')
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
