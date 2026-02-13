import API from "./Api";
import {
    api_url,
    customer_get_profile,
    customer_profile_picture,
    customer_profile_picture_update,
    customer_profile_update
} from "../../config/Constants";
import RNFetchBlob from "rn-fetch-blob";

const api = new API();

export const GetCustomerProfileApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_get_profile, {
                id: customerId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const UpdateCustomerProfileApi = (profileData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_profile_update, profileData)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const UploadProfilePictureApi = (base64Image) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await RNFetchBlob.fetch('POST', api_url + customer_profile_picture, {
                'Content-Type': 'multipart/form-data',
            }, [
                {
                    name: 'image',
                    filename: 'image.png',
                    data: base64Image
                }
            ]);
            const data = JSON.parse(result.data);
            resolve(data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const UpdateProfilePictureApi = (customerId, imageUrl) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post(customer_profile_picture_update, {
                id: customerId,
                profile_picture: imageUrl
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
