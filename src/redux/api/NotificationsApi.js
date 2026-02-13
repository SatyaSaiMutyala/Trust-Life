import API from "./Api";
import { customer_notification } from '../../config/Constants';

const api = new API();

export const GetNotificationsApi = (appModule) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_notification, {
                app_module: appModule
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
