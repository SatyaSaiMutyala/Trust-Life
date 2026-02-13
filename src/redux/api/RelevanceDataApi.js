import axios from "axios";
import { BaseUrl } from "../../config/Constants";

export const GetRelevanceDataApi = (endpoint, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if endpoint already has query parameters
            const separator = endpoint.includes('?') ? '&' : '?';
            const result = await axios.get(`${BaseUrl}${endpoint}${separator}page=${page}`);
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
