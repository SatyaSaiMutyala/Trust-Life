import API from "./Api";

const api = new API();

export const ApplyCouponApi = (couponCode, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await api.post('check-coupon', {
                coupon_code: couponCode,
                user_id: userId
            })
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    })
}
