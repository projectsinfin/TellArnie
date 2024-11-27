import { createSlice } from "@reduxjs/toolkit";
import { call_Profile_Api } from "../action/ProfileAction";

const profileSlice = createSlice({
  name: "getProfile",
  initialState: {
    profileDetails: null,
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      // Call Profile Api
      .addCase(call_Profile_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_Profile_Api.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileDetails = action.payload;
      })
      .addCase(call_Profile_Api.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});
export default profileSlice.reducer;
