import { ManageUser_API } from "../../config/urls";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/services";

export const call_ManageUser_Api = createAsyncThunk(
  "getManageUser",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("*****", credentials);
      const response = await axiosInstance.get(ManageUser_API);
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
