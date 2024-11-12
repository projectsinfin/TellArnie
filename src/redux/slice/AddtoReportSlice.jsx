import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  AddReportData: {},
  reportnewstatus: StatusCode.IDLE,
};
const { REPORTSDATA } = ApiEndPoint;
export const AddReportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsData.pending, (state, action) => {
        state.reportnewstatus = StatusCode.LOADING;
      })
      .addCase(fetchReportsData.fulfilled, (state, action) => {
        state.AddReportData = action.payload;
        state.reportnewstatus = StatusCode.IDLE;
      })
      .addCase(fetchReportsData.rejected, (state, action) => {
        state.reportnewstatus = StatusCode.ERROR;
      });
  },
});

export const {} = AddReportSlice.actions;
export default AddReportSlice.reducer;

export const fetchReportsData = createAsyncThunk(
  "admin/get/reports",
  async () => {
    try {
      const res = await API.get(REPORTSDATA);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch reports  data:", error);
      throw error;
    }
  }
);