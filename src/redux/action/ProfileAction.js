import {
  DeleteProfilePic_API,
  Profile_API,
  UpdateProfile_API,
} from "../../config/urls";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { makeFormDataRequest } from "../../utils/services";

export const call_Profile_Api = createAsyncThunk(
  "getProfile",
  async (credentials, { rejectWithValue }) => {
    try {
      //   console.log("*****", credentials);
      const response = await axiosInstance.get(Profile_API);

      // console.log("response*****", JSON.stringify(response));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_UpdateProfile_API = createAsyncThunk(
  "UpdateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await makeFormDataRequest(
        UpdateProfile_API,
        "put",
        formData
      );

      return response.data;
    } catch (error) {
      console.log("err call_UpdateProfile_API", error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_DeleteProfilePic_API = createAsyncThunk(
  "DeleteProfilePic",
  async (credentials, { rejectWithValue }) => {
    try {
      //   console.log("*****", credentials);
      const response = await axiosInstance.delete(DeleteProfilePic_API);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
