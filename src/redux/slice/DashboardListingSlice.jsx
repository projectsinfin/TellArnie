import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  DashboardListingData: {},
  status: StatusCode.IDLE,
};
const { DASHBOARDLISTING } = ApiEndPoint;
export const DashboardListingSlice = createSlice({
  name: "DashboardList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchdashboardListingData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchdashboardListingData.fulfilled, (state, action) => {
        state.DashboardListingData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchdashboardListingData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = DashboardListingSlice.actions;
export default DashboardListingSlice.reducer;

export const fetchdashboardListingData = createAsyncThunk(
  "admin/get/dashboard-listing",
  async () => {
    try {
      const res = await API.get(DASHBOARDLISTING);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard listing data:", error);
      throw error;
    }
  }
);
