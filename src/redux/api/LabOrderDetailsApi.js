import API from "./Api";

const api = new API();

export const GetLabOrderDetailsApi = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/lab/get_order_detail', {
                order_id: orderId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
