import { call_KisStatus_API } from "../action/ManageKits";

import { createSlice } from "@reduxjs/toolkit";

const kistStatusSlice = createSlice({
  name: "KisStatus",
  initialState: {
    kitStatus: null,
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      // Call kist Status Api
      .addCase(call_KisStatus_API.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_KisStatus_API.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileDetails = action.payload;
      })
      .addCase(call_KisStatus_API.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});
export default kistStatusSlice.reducer;
