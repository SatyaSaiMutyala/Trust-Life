import API from "./Api";

const api = new API();

export const GetLabPendingOrdersApi = (customerId, filter = 'all', perPage = 10, page = 1) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/lab/get_lab_orders', {
                customer_id: customerId,
                filter: filter,
                per_page: perPage,
                page: page
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
