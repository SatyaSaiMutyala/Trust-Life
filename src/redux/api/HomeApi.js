import API from "./Api";
import { home } from '../../config/Constants';

const api = new API();

export const GetHomeDetailsApi = (lat, lng) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(home, {
                lat: lat,
                lng: lng
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
