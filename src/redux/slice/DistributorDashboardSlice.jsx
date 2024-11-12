import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  DistributorDashboardData: {},
  status: StatusCode.IDLE,
};
const { DISTRUBUTORDASHBOARD } = ApiEndPoint;
export const DistributorDashboardSlice = createSlice({
  name: "DistributorDashboardList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchdistributordashboardData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchdistributordashboardData.fulfilled, (state, action) => {
        state.DistributorDashboardData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchdistributordashboardData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = DistributorDashboardSlice.actions;
export default DistributorDashboardSlice.reducer;

export const fetchdistributordashboardData = createAsyncThunk(
  "admin/get/dashboard-distributor",
  async () => {
    try {
      const res = await API.get(DISTRUBUTORDASHBOARD);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard listing data:", error);
      throw error;
    }
  }
);
