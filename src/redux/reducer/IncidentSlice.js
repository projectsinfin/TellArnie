import { createSlice } from "@reduxjs/toolkit";
import {
  call_IncidentCategory_Api,
  call_PersonOftreatment_Api,
} from "../action/IncidentReport";

createSlice;
const IncidentSlice = createSlice({
  name: "IncidentCategory",
  initialState: {
    incidentCategoryDetails: null,
    listOfPerson: null,
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      // Call IncidentCategory Api
      .addCase(call_IncidentCategory_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_IncidentCategory_Api.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidentCategoryDetails = action.payload;
      })
      .addCase(call_IncidentCategory_Api.rejected, (state, action) => {
        state.isLoading = false;
        console.log("install kit detail list err", action);
        state.error = action.payload.message;
      }) // Call PersonList Api
      .addCase(call_PersonOftreatment_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_PersonOftreatment_Api.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listOfPerson = action.payload;
      })
      .addCase(call_PersonOftreatment_Api.rejected, (state, action) => {
        state.isLoading = false;
        console.log("install kit detail list err", action);
        state.error = action.payload.message;
      });
  },
});
export default IncidentSlice.reducer;
