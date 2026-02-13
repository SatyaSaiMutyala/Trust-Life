import API from "./Api";

const api = new API();

export const DeleteCartItemApi = (customerId, cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/cart/delete', {
                customer_id: customerId,
                cart_id: cartId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
