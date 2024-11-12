import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import { toast } from "react-toastify";
import API from "../../services/api";
const initialState = {
  CreateUserData: {},
  FetchLocationData: {},
  status: StatusCode.IDLE,
};
const { ADMINFETCHLOCATION, CREATENEWUSER ,INVITE} = ApiEndPoint;
export const createUserSlice = createSlice({
  name: "createUser/fetch/location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // case for get location
      .addCase(fetchLocation.pending, (state, action) => {
        // state.status = StatusCode.LOADING;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.FetchLocationData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      //  case for create user
      .addCase(createNewUser.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.CreateUserData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // send email
      .addCase(inviteViaEmail.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(inviteViaEmail.fulfilled, (state, action) => {
        state.CreateUserData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(inviteViaEmail.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
  },
});

export const {} = createUserSlice.actions;
export default createUserSlice.reducer;
export const fetchLocation = createAsyncThunk("fetch/location", async () => {
  try {
    const res = await API.get(`${ADMINFETCHLOCATION}`);
    return res.data;
  } catch (error) {
    toast.error(error.data?.message);
  }
});

export const createNewUser = createAsyncThunk(
  "create/new/user",
  async (data) => {
    console.log(data.cb,"data cb")
    try {
      const res = await API.post(`${CREATENEWUSER}`, data.payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(res, "response user");
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      console.log(error, "error");
      if (error.data.status === 401) {
        // console.log("errpor catch")
        data.cb()
      } else {
        toast.error(error?.data?.message);
      }
    }
  }
);


// create batch kits

export const inviteViaEmail = createAsyncThunk(
  "create/users/invite",
  async (data) => {
    try {
      const res = await API.post(`${INVITE}`, data);
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      console.log(res,"response invite via email")
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  }
);
