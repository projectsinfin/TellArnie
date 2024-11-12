import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  LoginData: {
    data: { permissions: [] },
  },
  status: StatusCode.IDLE,
};
const { LOGIN } = ApiEndPoint;
export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginuser.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(loginuser.fulfilled, (state, action) => {
        state.LoginData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(loginuser.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = loginSlice.actions;
export default loginSlice.reducer;
export const loginuser = createAsyncThunk("user/login", async (data) => {
  try {
    const res = await API.post(`${LOGIN}`, data);
    if (res.data?.status === 200) {
      toast.success(res.data?.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.data?.message);
  }
});
