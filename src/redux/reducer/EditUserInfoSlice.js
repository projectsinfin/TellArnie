import { createSlice } from "@reduxjs/toolkit";
import { call_get_UserInfo } from "../action/AdminAction";

const EditUserInfoSlice = createSlice({
  name: "editUerInfo",
  initialState: {
    editUserDetails: null,
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      // Call editProfile Api
      .addCase(call_get_UserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_get_UserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editUserDetails = action.payload;
      })
      .addCase(call_get_UserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});
export default EditUserInfoSlice.reducer;
