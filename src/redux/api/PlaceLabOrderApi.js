import API from "./Api";

const api = new API();

export const PlaceLabOrderApi = (orderData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/lab/place_order', orderData)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
