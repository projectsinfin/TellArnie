import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  ClientDistributorData: {},
  status: StatusCode.IDLE,
};
const {  DISTRIBUTORCLIENTMANAGEMENT } = ApiEndPoint;
export const ClientDistributionSlice = createSlice({
  name: "distributorrclientegistration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(fetchDistributorClientData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchDistributorClientData.fulfilled, (state, action) => {
        state.ClientDistributorData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchDistributorClientData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = ClientDistributionSlice.actions;
export default ClientDistributionSlice.reducer;



// Fetch client listing
export const fetchDistributorClientData = createAsyncThunk(
  "admin/get/distributor",
  async () => {
    try {
      const res = await API.get(DISTRIBUTORCLIENTMANAGEMENT);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch distributor management data:", error);
      throw error;
    }
  }
);
