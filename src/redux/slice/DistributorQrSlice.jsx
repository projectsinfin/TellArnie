import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  DistributorQRData: [],
  status: StatusCode.IDLE,
};
const {DISTRIBUTORQR} = ApiEndPoint;
export const DistributorQRDataSlice = createSlice({
  name: "DistributorQR",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributorQRData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchDistributorQRData.fulfilled, (state, action) => {
        state.DistributorQRData = action.payload.data;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchDistributorQRData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
    
       
      
  },
});

export default DistributorQRDataSlice.reducer;

export const fetchDistributorQRData = createAsyncThunk(
  "admin/get/QR",
  async () => {
    try {
      const res = await API.get(DISTRIBUTORQR);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch QR data:", error);
      throw error;
    }
  }
);


