import axios from 'axios';
import { api_url, customer_lab_detail } from '../../config/Constants';

export const LabDetailsApi = async (labId) => {
    try {
        const response = await axios({
            method: 'post',
            url: api_url + customer_lab_detail,
            data: { lab_id: labId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
