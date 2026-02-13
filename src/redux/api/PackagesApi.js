import axios from 'axios';
import { BaseUrl } from '../../config/Constants';

export const PackagesApi = async (testType) => {
    try {
        const response = await axios.get(`${BaseUrl}packages?page=1&${testType}=1`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
