import API from "./Api";

const api = new API();

export const GetPatientsApi = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.get(`customer/patients?customer_id=${customerId}`)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}

export const DeletePatientApi = (customerId, patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.delete(`customer/patients?customer_id=${customerId}&patient_id=${patientId}`)
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
