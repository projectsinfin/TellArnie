import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import { toast } from "react-toastify";
import API from "../../services/api";
const initialState = {
  CreateReportData: {},
  reportstatus: StatusCode.IDLE,
};
const { CREATEGROUPREPORT } = ApiEndPoint;
export const createReportSlice = createSlice({
  name: "createreport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // case for get location
      .addCase(createReport.pending, (state, action) => {
        state.reportstatus = StatusCode.LOADING;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.CreateReportData = action.payload;
        state.reportstatus = StatusCode.IDLE;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.reportstatus = StatusCode.ERROR;
      });
  },
});

export const {} = createReportSlice.actions;
export default createReportSlice.reducer;

export const createReport = createAsyncThunk(
  "create/report/group",
  async (data) => {
    try {
      const res = await API.post(`${CREATEGROUPREPORT}`, data);
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  }
);
