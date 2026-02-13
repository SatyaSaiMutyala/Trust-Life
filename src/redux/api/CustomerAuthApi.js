import API from "./Api";
import { customer_login, customer_registration, customer_check_phone } from '../../config/Constants';

const api = new API();

export const CustomerLoginApi = (phoneWithCode, fcmToken, otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_login, {
                phone_with_code: phoneWithCode,
                fcm_token: fcmToken,
                otp: otp
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const CustomerRegisterApi = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_registration, data)
            console.log('this is API Data -------->', result.data);
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const CheckPhoneApi = (phoneWithCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_check_phone, {
                phone_with_code: phoneWithCode
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
