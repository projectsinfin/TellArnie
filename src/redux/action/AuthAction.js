// import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Forget_Password_API,
  LOGIN_API,
  OTP_API,
  RegisterApprovalOffice_API,
  RegisterCompany_API,
  ResetPassword_API,
  SIGNUP_API,
} from "../../config/urls";
import axios from "axios";
import { clearTokens, setTokens } from "../reducer/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = (accessToken, refreshToken, role) => async (dispatch) => {
  await AsyncStorage.setItem("AccessToken", accessToken);
  await AsyncStorage.setItem("ReffToken", refreshToken);
  await AsyncStorage.setItem("role", role);
  dispatch(setTokens({ accessToken, refreshToken }));
};

export const logout = () => async (dispatch) => {
  await AsyncStorage.removeItem("AccessToken");
  await AsyncStorage.removeItem("ReffToken");
  await AsyncStorage.removeItem("role");
  dispatch(clearTokens());
};

export const call_Login_Api = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****", credentials);
      const response = await axios.post(LOGIN_API, credentials);
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_SignUp_Api = createAsyncThunk(
  "auth/signupUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****", credentials);
      const response = await axios.post(SIGNUP_API, credentials);
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_Otp_Api = createAsyncThunk(
  "auth/signupUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****", credentials);
      const response = await axios.post(OTP_API, credentials);
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_RegisteCompany_Api = createAsyncThunk(
  "auth/registerCompany",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****", credentials);
      const response = await axios.post(RegisterCompany_API, credentials);
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const Call_RegisterApproval_Api = createAsyncThunk(
  "auth/registerApproverOffice",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****", credentials);
      const response = await axios.post(
        RegisterApprovalOffice_API,
        credentials
      );
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_ForgetPassword_API = createAsyncThunk(
  "auth/Forget_Password",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** Forget_Password_API", credentials);
      const response = await axios.post(Forget_Password_API, credentials);
      // console.log("response***** Forget_Password_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_ResetPassword_API = createAsyncThunk(
  "auth/ResetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** ResetPassword_API", credentials);
      const response = await axios.post(ResetPassword_API, credentials);
      // console.log("response***** ResetPassword_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
