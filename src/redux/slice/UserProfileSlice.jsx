import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  BusinessprofileForm: {},
  formloadstatus: StatusCode.IDLE,
};
const { BUSINESSPROFILEFORM, UPDATEBUSINESSPROFILE } = ApiEndPoint;
export const UserProfileSlice = createSlice({
  name: "Businessprofile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileData.pending, (state, action) => {
        // state.status = StatusCode.LOADING;
      })
      .addCase(fetchUserProfileData.fulfilled, (state, action) => {
        state.BusinessprofileForm = action.payload;
        state.formloadstatus = StatusCode.IDLE;
      })
      .addCase(fetchUserProfileData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })

      .addCase(UpdateBusinessProfile.pending, (state, action) => {
        state.formloadstatus = StatusCode.LOADING;
      })
      .addCase(UpdateBusinessProfile.fulfilled, (state, action) => {
        state.formloadstatus = StatusCode.IDLE;
      })
      .addCase(UpdateBusinessProfile.rejected, (state, action) => {
        state.formloadstatus = StatusCode.ERROR;
      });
  },
});

export const {} = UserProfileSlice.actions;
export default UserProfileSlice.reducer;

export const fetchUserProfileData = createAsyncThunk(
  "admin/get/businessprofileform",
  async () => {
    try {
      const res = await API.get(BUSINESSPROFILEFORM);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch BUSINESSPROFILE form data:", error);
      throw error;
    }
  }
);
export const UpdateBusinessProfile = createAsyncThunk(
  "update/user",
  async (data) => {
    try {
      const res = await API.put(`${UPDATEBUSINESSPROFILE}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }
);
