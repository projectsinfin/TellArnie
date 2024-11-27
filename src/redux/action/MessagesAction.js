import { createAsyncThunk } from "@reduxjs/toolkit";
import { DetailsMessage_API, ShowMessage_API } from "../../config/urls";
import axiosInstance from "../../utils/services";

export const call_ShowMessage_API = createAsyncThunk(
  "ShowMessage_API",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("*****", ShowMessage_API);
      const response = await axiosInstance.get(ShowMessage_API);
      // console.log("response*****", ShowMessage_API);
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
      console.log("*****", DetailsMessage_API);
      const response = await axiosInstance.get(
        DetailsMessage_API + credentials
      );
      // console.log("response*****", DetailsMessage_API);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
