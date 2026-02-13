import axios from "axios";
import { STATUS_CODE, BASE_URL } from "./CommonApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Request Methods
const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

/*
* API controller for handling the request
*/
class API {
  isLoggedIn = false;
  userData = {};
  userToken = null;

  constructor() {
    this.baseURL = BASE_URL;
  }

  get(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.GET, url, data)
        .then((response) => resolve(response))
        .catch((error) => {
          console.error("GET request error:", error);
          reject(error);
        });
    });
  }

  post(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.POST, url, data)
        .then((response) => resolve(response))
        .catch((error) => {
          console.error("POST request error:", error);
          reject(error);
        });
    });
  }

  put(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.PUT, url, data)
        .then((response) => resolve(response))
        .catch((error) => {
          console.error("PUT request error:", error);
          reject(error);
        });
    });
  }

  delete(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.DELETE, url, data)
        .then((response) => resolve(response))
        .catch((error) => {
          console.error("DELETE request error:", error);
          reject(error);
        });
    });
  }

  // Main function to hold the axios request params
  async api(method, url, data) {
    return new Promise(async (resolve, reject) => {
      let axiosConfig = {
        method: method,
        url: this.baseURL + url,
        headers: await this.setHeaders(data),
      };

      if (data) {
        axiosConfig.data = data;
      }

      axios(axiosConfig)
        .then((response) => {
          if (response && response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
            Alert.alert("Error", "Something went wrong!!");
          } else {
            resolve(response);
          }
        })
        .catch((error) => {
          let err = error?.response;
          console.error("ERROR", error);

          // Handle specific errors based on status
          if (err?.status === 401) {
            console.log("Unauthorized");
          } else if (err?.status === 422) {
            console.log("Validation error:", err?.data?.errors);
          } else {
            console.log("An error occurred");
          }

          reject(error);  // Ensure the error is propagated
        });
    });
  }

  // Set the headers for request
  async setHeaders(data) {
    const token = await AsyncStorage.getItem('token');

    let headers = {
      "accept-language": "en",
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token || '',
    };

    if (data) {
      if (data.isMultipart) {
        headers["Content-Type"] = "multipart/form-data";
      }
      if (data.headers) {
        Object.assign(headers, data.headers);
      }
    }

    return headers;
  }
}

export default API;
