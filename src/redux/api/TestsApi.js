import axios from 'axios';
import { BaseUrl } from '../../config/Constants';

export const TestsApi = async () => {
    try {
        const response = await axios.get(`${BaseUrl}testsList?page=1`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
