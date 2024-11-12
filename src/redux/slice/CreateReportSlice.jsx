import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import { toast } from "react-toastify";
import API from "../../services/api";
const initialState = {
  CreateNewReportData: {},
  reportstatus: StatusCode.IDLE,
};
const { CREATEREPORT } = ApiEndPoint;
export const createNewReportSlice = createSlice({
  name: "createreport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // case for get location
      .addCase(createNewReport.pending, (state, action) => {
        state.reportstatus = StatusCode.LOADING;
      })
      .addCase(createNewReport.fulfilled, (state, action) => {
        state.CreateNewReportData = action.payload;
        state.reportstatus = StatusCode.IDLE;
      })
      .addCase(createNewReport.rejected, (state, action) => {
        state.reportstatus = StatusCode.ERROR;
      });
  },
});

export const {} = createNewReportSlice.actions;
export default createNewReportSlice.reducer;

export const createNewReport = createAsyncThunk(
    "create/report",
    async (data, { rejectWithValue }) => {
      try {
        const res = await API.post(`${CREATEREPORT}`, data);
        if (res.status === 200) {
          toast.success(res.data?.message);
          return res.data;
        } else {
          return rejectWithValue("Failed to create report");
        }
      } catch (error) {
        toast.error("Failed to create report");
        return rejectWithValue(error.message);
      }
    }
  );
  