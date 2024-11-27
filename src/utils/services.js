import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { API_BASE_URL, API_RefreshToken } from "../config/urls";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, //import base url from congig file
});
const requestHandler = async (request) => {
  // console.log("---request-- ", request);
  const accessToken = await AsyncStorage.getItem("AccessToken");

  try {
    request.headers["Authorization"] = "Bearer " + accessToken;
  } catch (e) {
    console.log(e, "err");
  }
  // console.log("---accessToken-4- ", request);
  return request;
};

const refreshToken = async () => {
  try {
    const refreshTokenValue = await AsyncStorage.getItem("ReffToken");
    const response = await axiosInstance.post(API_RefreshToken, {
      refresh_token: refreshTokenValue,
    });

    if (response.status === 200) {
      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      // Update the stored tokens
      await AsyncStorage.setItem("AccessToken", newAccessToken);
      await AsyncStorage.setItem("ReffToken", newRefreshToken);

      return newAccessToken;
    } else {
      // Handle error response (e.g., logout user, show login screen)
      console.error("Token refresh failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
};

const responseHandler = (response) => {
  return response;
};
axiosInstance.interceptors.request.use(requestHandler, (error) => {
  Promise.reject(error);
});
axiosInstance.interceptors.response.use(responseHandler, async (error) => {
  if (error.response && error.response.status !== 401) {
    if (error.response.data) return Promise.reject(error.response.data);
    return Promise.reject(error);
  }
  if (error.response && error.response.status === 401) {
    if (error.response.status === 401) {
      const newAccessToken = await refreshToken();
      console.log("newAccessTokennewAccessToken", newAccessToken);
      if (error.response.data) return Promise.reject(error.response.data);
      // message.error("Login session timed out! please login again");
      return Promise.reject(error);
    }
  } else if (error.response && error.response.status === 500) {
    if (error.response.status === 500) {
      console.log("internal-server-error");
      alert("internal-server-error");
    }
  }
});
export default axiosInstance;

// Function to handle dynamic method with form-data
export const makeFormDataRequest = async (url, method, formData) => {
  try {
    const accessToken = await AsyncStorage.getItem("AccessToken");
    const response = await axiosInstance.request({
      url,
      method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("formdata response---", JSON.stringify(response));
    return response;
  } catch (error) {
    alert(error.message);
    console.error("Error in makeFormDataRequest:", error);
    return error.response;
  }
};

export const makeFormDataRequests = async (url, method, formData) => {
  try {
    const accessToken = await AsyncStorage.getItem("AccessToken");
    const response = await axios.request({
      url,
      method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("formdata response---", JSON.stringify(response));
    return response;
  } catch (error) {
    // alert(JSON.stringify(error.message));
    console.error("Error in makeFormDataRequest:", error);
    return error.response;
  }
};
