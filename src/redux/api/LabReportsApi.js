import API from "./Api";

const api = new API();
const endPoint = 'customer/get_customer_reports';

export const GetLabReportsApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.get(`${endPoint}/${customerId}`)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
