import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";

// Fetch client listing
export const fetchReportsListData = createAsyncThunk(
  "admin/get/reports",
  async () => {
    try {
      const res = await API.get(REPORTS);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch distributor management data:", error);
      throw error;
    }
  }
);
// DELETE REPORTS LIST

export const deleteReportListData = createAsyncThunk(
  "admin/delete/reports",
  async (data) => {
    try {
      const res = await API.delete(`${DELETEREPORTLISTDATA}`, {
        data: data,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
        return data;
      }
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);
export const fetchReportListDataById = createAsyncThunk(
  "admin/get/report-listing-data",
  async (id) => {
    try {
      const res = await API.get(`${REPORTDATABYID}?id=${id}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch  data:", error);
      throw error;
    }
  }
);

export const updateReportListDetails = createAsyncThunk(
  "admin/update-reportlist-details",
  async (data) => {
    console.log(data, "data");
    try {
      const res = await API.put(
        `${UPDATE_REPORT_DETAILS}?reportId=${data.id}`,
        data
      );
      if (res.data?.status === 200) {
        return res.data;
      }
      return res
    } catch (error) {
      console.error("Failed to update details:", error);
      throw error;
    }
  }
);

const initialState = {
  fetchReportListingData: [],
  status: StatusCode.IDLE,
};

const { REPORTS, DELETEREPORTLISTDATA, REPORTDATABYID, UPDATE_REPORT_DETAILS } =
  ApiEndPoint;

export const ReportsSlice = createSlice({
  name: "reportslistingData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsListData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchReportsListData.fulfilled, (state, action) => {
        state.fetchReportListingData = action.payload.data;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchReportsListData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // DELETE USER
      .addCase(deleteReportListData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(deleteReportListData.fulfilled, (state, action) => {
        state.fetchReportListingData = state.fetchReportListingData?.filter(
          (curElm) => !action.payload?.reportIds.includes(curElm._id)
        );
        state.status = StatusCode.IDLE;
      })
      .addCase(deleteReportListData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // get Group data by id

      .addCase(fetchReportListDataById.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchReportListDataById.fulfilled, (state, action) => {
        state.fetchReportListingData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchReportListDataById.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })

      // update
      .addCase(updateReportListDetails.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(updateReportListDetails.fulfilled, (state, action) => {
        state.fetchReportListingData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(updateReportListDetails.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = ReportsSlice.actions;
export default ReportsSlice.reducer;
