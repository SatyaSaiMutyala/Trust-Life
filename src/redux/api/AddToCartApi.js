import API from "./Api";

const api = new API();

export const AddToCartApi = (serviceId, customerId, price, serviceType) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/cart', {
                service_id: serviceId,
                customer_id: customerId,
                price: price,
                service_type: serviceType
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
