import API from "./Api";

const api = new API();

export const GetTaxListApi = (serviceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('other_charges', {
                service_id: serviceId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
