// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  Call_RegisterApproval_Api,
  call_Login_Api,
  call_SignUp_Api,
  call_RegisteCompany_Api,
  call_ResetPassword_API,
} from "../action/AuthAction";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    error: null,
    isLoading: false,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Call Login Api
      .addCase(call_Login_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_Login_Api.fulfilled, (state, action) => {
        // console.log(state, "---+++--", action);
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(call_Login_Api.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Call Signup Api
      .addCase(call_SignUp_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_SignUp_Api.fulfilled, (state, action) => {
        // console.log(state, "---+++--", action);
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(call_SignUp_Api.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // call RegisterCompany_Api
      .addCase(call_RegisteCompany_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_RegisteCompany_Api.fulfilled, (state, action) => {
        // console.log(state, "---+++--", action);
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(call_RegisteCompany_Api.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // call RegisterApprover_Api
      .addCase(Call_RegisterApproval_Api.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Call_RegisterApproval_Api.fulfilled, (state, action) => {
        // console.log(state, "---+++--", action);
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(Call_RegisterApproval_Api.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      // Call ResetPassword Api
      .addCase(call_ResetPassword_API.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(call_ResetPassword_API.fulfilled, (state, action) => {
        // console.log(state, "---+++--", action);
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(call_ResetPassword_API.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logoutUser, setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
