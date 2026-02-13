import axios from 'axios';
import { BaseUrl } from '../../config/Constants';

export const ProfilesApi = async (type) => {
    try {
        const response = await axios.get(`${BaseUrl}profiles?page=1&${type}=1`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
