import {
  KisStatus_API,
  KisStatus_details_API,
  UpdateProduct_API,
} from "../../config/urls";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/services";

export const call_KisStatus_API = createAsyncThunk(
  "KisStatus",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** KisStatus_API", credentials);
      const response = await axiosInstance.get(KisStatus_API);
      // console.log("response***** KisStatus_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_UpdateRiskCal = createAsyncThunk(
  "UpdateRiskCal",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** UpdateRiskCal", credentials);
      const response = await axiosInstance.post(
        KisStatus_details_API,
        credentials
      );
      // console.log("response***** KisStatus_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_UpdateProduct_API = createAsyncThunk(
  "UpdateProduct_API",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** UpdateProduct_API", credentials);
      const response = await axiosInstance.post(
        UpdateProduct_API + credentials.id,
        credentials
      );
      // console.log("response***** UpdateProduct_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
