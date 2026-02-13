import { api_url } from "../../config/Constants";
import { Platform } from "react-native";

const endPoint = 'customer/add_report';

export const UploadReportApi = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('customer_id', data.customer_id);
            formData.append('patient_name', data.patient_name);
            formData.append('member', data.member);
            formData.append('reports', {
                uri: Platform.OS === 'android' ? data.file.uri : data.file.uri.replace('file://', ''),
                type: data.file.type,
                name: data.file.name,
            });

            const response = await fetch(`${api_url}${endPoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const result = await response.json();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};
