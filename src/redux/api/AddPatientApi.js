import API from "./Api";

const api = new API();

export const AddPatientApi = (customerId, name, dateOfBirth, gender, relation) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('customer/add-family-member', {
                customer_id: customerId,
                name: name,
                date_of_birth: dateOfBirth,
                gender: gender,
                relation: relation
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
