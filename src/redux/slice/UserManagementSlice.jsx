import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  UserManagementData: [],
  status: StatusCode.IDLE,
};
const {
  USERMANAGEMENT,
  USERMANAGEMENTDATABYID,
  UPDATEUSERMANAGEMENTDATA,
  DELETEUSERMANAGEMENTDATA,
} = ApiEndPoint;
export const UserManagementSlice = createSlice({
  name: "usermanagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchUserManagementData.fulfilled, (state, action) => {
        state.UserManagementData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchUserManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // GET USER BY ID
      .addCase(fetchUserManagementDataById.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchUserManagementDataById.fulfilled, (state, action) => {
        state.UserManagementData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchUserManagementDataById.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })

      // UPDATE USER
      .addCase(updateUserManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(updateUserManagementData.fulfilled, (state, action) => {
        state.UserManagementData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(updateUserManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })

      // DELETE USER
      .addCase(deleteUserManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(deleteUserManagementData.fulfilled, (state, action) => {
        state.UserManagementData = state.UserManagementData?.filter(
          (curElm) => !action.payload?.userIds.includes(curElm._id)
        );
        state.status = StatusCode.IDLE;
      })
      .addCase(deleteUserManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = UserManagementSlice.actions;
export default UserManagementSlice.reducer;

export const fetchUserManagementData = createAsyncThunk(
  "admin/get/users",
  async () => {
    try {
      const res = await API.get(USERMANAGEMENT);
      if (res.data?.status === 200) {
        return res.data?.data?.Users;
      }
    } catch (error) {
      console.error("Failed to fetch User management data:", error);
      throw error;
    }
  }
);

export const fetchUserManagementDataById = createAsyncThunk(
  "admin/get/user",
  async (id) => {
    try {
      const res = await API.get(`${USERMANAGEMENTDATABYID}/${id}`);
      return res.data?.data?.user_details;
    } catch (error) {
      console.error("Failed to fetch User management data:", error);
      throw error;
    }
  }
);

// export const updateUserManagementData = createAsyncThunk(
//   "admin/update/user",
//   async ({ values, id }) => {
//     try {
//       const res = await API.put(`${UPDATEUSERMANAGEMENTDATA}/${id}`, values, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     } catch (error) {
//       toast.error(error.data?.message);
//       throw error;
//     }
//   }
// );
export const updateUserManagementData = createAsyncThunk(
  "admin/update/user",
  async ({ values, id }) => {
    try {
      const res = await API.put(`${UPDATEUSERMANAGEMENTDATA}/${id}`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Return the response data
      return res.data;
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);


export const deleteUserManagementData = createAsyncThunk(
  "admin/delete/user",
  async (data) => {
    try {
      const res = await API.delete(`${DELETEUSERMANAGEMENTDATA}`, {
        data: data,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
        return data;
      }
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);
