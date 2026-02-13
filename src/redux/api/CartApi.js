import API from "./Api";

const api = new API();

export const GetCartApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.get(`customer/${customerId}/cart`)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
