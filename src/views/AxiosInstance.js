
import axios from 'axios';
import { api_url, base_url } from '../config/Constants';

const axiosInstance = axios.create({
    baseURL: api_url,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': global.fcm_token,
    },
});

export default axiosInstance;
