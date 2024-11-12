import {
  AddLocation_API,
  EnterManuallyKit_API,
  GetLocation_API,
  InstallKitDetails_API,
  NotFoundKit_API,
} from "../../config/urls";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { makeFormDataRequest } from "../../utils/services";

export const call_InstallKitDetails = createAsyncThunk(
  "getInstallKitDetails",
  async (credentials, { rejectWithValue }) => {
    try {
    
      const response = await axiosInstance.get(InstallKitDetails_API, {
        params: credentials,
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_EnterManuallyKit = createAsyncThunk(
  "EnterManuallyKit",
  async (credentials, { rejectWithValue }) => {
    try {
    
      const response = await makeFormDataRequest(
        EnterManuallyKit_API,
        "post",
        credentials
      );
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AddBarcodeItem_Kit = createAsyncThunk(
  "AddBarcodeItem_Kit",
  async (formData, { rejectWithValue }) => {
    try {
    
      const response = await makeFormDataRequest(
        EnterManuallyKit_API,
        "post",
        formData
      );
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AddItem_Kit = createAsyncThunk(
  "AddItem",
  async (credentials, { rejectWithValue }) => {
    try {
     
      const response = await axiosInstance.post(
        EnterManuallyKit_API,
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_NotFoundKit_API = createAsyncThunk(
  "NotFoundKit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await makeFormDataRequest(
        NotFoundKit_API,
        "post",
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_GetLocation_API = createAsyncThunk(
  "getLocation",
  async (res, { rejectWithValue }) => {
    try {
 
      const response = await axiosInstance.get(GetLocation_API);
   
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AddLocation_API = createAsyncThunk(
  "AddLocation",
  async (formData, { rejectWithValue }) => {
    try {
    
      const response = await makeFormDataRequest(
        AddLocation_API,
        "post",
        formData
      );
   
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const CallUploadImage = (formData) => {
  return axiosInstance
    .post(AddLocation_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res?.data)
    .catch((err) => err);
};
