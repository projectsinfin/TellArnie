import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";

// Define initial state
const initialState = {
  data: [],
  status: StatusCode.IDLE,
  error: null,
};

// Extract API endpoints
const { REPORTSLISTING, DELETEREPORTGROUPDATA,UPDATE_GROUP_DETAILS ,GROUPDATABYID} = ApiEndPoint;

// Create async thunk for fetching reports listing data
export const fetchReportsListingData = createAsyncThunk(
  "reports/fetchReportsListingData",
  async () => {
    try {
      const response = await API.get(REPORTSLISTING);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch reports listing data:", error.message);
      throw error;
    }
  }
);

export const deleteReportGroupData = createAsyncThunk(
  "admin/delete/reports",
  async (id) => {
    try {
      const res = await API.delete(`${DELETEREPORTGROUPDATA}?id=${id}`);
      if (res.status === 200) {
        toast.success(res?.data?.message);
        return id;
      }
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);
// update report group details
export const updateGroupDetails = createAsyncThunk(
  "admin/update-distributor-details",
  async (data ) => {
    console.log(data,"data")
    try {
      const res = await API.put(`${UPDATE_GROUP_DETAILS}?groupId=${data.id}`, data);
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

export const fetchGroupDataById = createAsyncThunk(
  "admin/get/groupdata",
  async (id) => {
    try {
      const res = await API.get(`${GROUPDATABYID}?id=${id}`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch  data:", error);
      throw error;
    }
  }
);


// Create reports listing slice
export const reportsListingSlice = createSlice({
  name: "reportsListing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsListingData.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(fetchReportsListingData.fulfilled, (state, action) => {
        state.status = StatusCode.IDLE;
        state.data = action.payload.data; 
        // Assigning action.payload directly
      })

      .addCase(fetchReportsListingData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
        state.error = action.error.message;
      })
      // Delete Reports Data
      .addCase(deleteReportGroupData.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(deleteReportGroupData.fulfilled, (state, action) => {
        // Filter out the deleted report group from the data array
        const {
          meta: { arg },
        } = action;
        state.data = state.data.filter(
          (report) => report.id !== arg
        );
        state.status = StatusCode.IDLE;
      })
      .addCase(deleteReportGroupData.rejected, (state) => {
        state.status = StatusCode.ERROR;
      })
      // get Group data by id
       
       .addCase(fetchGroupDataById.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchGroupDataById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchGroupDataById.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // update
      .addCase(updateGroupDetails.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(updateGroupDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(updateGroupDetails.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })


  },
});

// Export reducer and actions
export const {} = reportsListingSlice.actions;
export default reportsListingSlice.reducer;
