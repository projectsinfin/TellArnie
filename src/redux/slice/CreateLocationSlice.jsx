import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import { toast } from "react-toastify";
import API from "../../services/api";
const initialState = {
  CreateLocationData: {},
  ApproversSuperAdminsData: {},
  status: StatusCode.IDLE,
};
const { SUPERADMINAPPROVERDATA, ADDLOCATION } = ApiEndPoint;
export const createLocationSlice = createSlice({
  name: "createlocation/fetch/location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // case for get location
      .addCase(fetchsuperadminapproverdata.pending, (state, action) => {
        // state.status = StatusCode.LOADING;
      })
      .addCase(fetchsuperadminapproverdata.fulfilled, (state, action) => {
        state.ApproversSuperAdminsData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchsuperadminapproverdata.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      //  case for create user
      .addCase(createLocation.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.CreateLocationData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = createLocationSlice.actions;
export default createLocationSlice.reducer;
export const fetchsuperadminapproverdata = createAsyncThunk(
  "fetch/superadmin/approver/list",
  async () => {
    try {
      const res = await API.get(`${SUPERADMINAPPROVERDATA}`);
      return res.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const createLocation = createAsyncThunk(
  "create/location",
  async (data) => {
    try {
      const res = await API.post(`${ADDLOCATION}`, data);
      if (res.status === 201) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  }
);
