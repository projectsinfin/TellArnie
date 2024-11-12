import { createSlice } from "@reduxjs/toolkit";
import {
  call_GetLocation_API,
  call_InstallKitDetails,
} from "../action/KitInstallationAction";

const InstallKitsSlice = createSlice({
  name: "InstallKitsSlice",
  initialState: {
    installKitDetails: null,
    enterLocationDetails: null,
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      // Call InstallKitsSlice Api
      .addCase(call_InstallKitDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_InstallKitDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.installKitDetails = action.payload;
      })
      .addCase(call_InstallKitDetails.rejected, (state, action) => {
        state.isLoading = false;
        console.log(
          "call_InstallKitDetails install kit detail list err",
          action
        );
        state.error = action.payload.message;
      })
      //call get Location api
      .addCase(call_GetLocation_API.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_GetLocation_API.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enterLocationDetails = action.payload;
      })
      .addCase(call_GetLocation_API.rejected, (state, action) => {
        state.isLoading = false;
        console.log("install kit call_GetLocation_API list err", action);
        state.error = action.payload.message;
      });
  },
});
export default InstallKitsSlice.reducer;
