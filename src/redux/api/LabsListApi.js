import API from "./Api";

const api = new API();

export const GetLabsListApi = (lat, lng, search = "") => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/lab_list', {
                lat: lat,
                lng: lng,
                search: search
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
