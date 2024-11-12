import { createAsyncThunk } from "@reduxjs/toolkit";
import { DetailsMessage_API, ShowMessage_API } from "../../config/urls";
import axiosInstance from "../../utils/services";

export const call_ShowMessage_API = createAsyncThunk(
  "ShowMessage_API",
  async (credentials, { rejectWithValue }) => {
    try {
 
      const response = await axiosInstance.get(ShowMessage_API);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_DetailsMessage_API = createAsyncThunk(
  "DetailsMessage_API",
  async (credentials, { rejectWithValue }) => {
    try {
     
      const response = await axiosInstance.get(
        DetailsMessage_API + credentials
      );
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
