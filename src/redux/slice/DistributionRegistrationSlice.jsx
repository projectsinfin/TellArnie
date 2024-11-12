import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  DistributorRegisaterData: [],
  status: StatusCode.IDLE,
};
const {
  DISTRIBUTORREGISTER,
  DISTRIBUTORMANAGEMENT,
  UPDATEDISTRIBUTORMANAGEMENTDATA,
  GET_DISTRIBUTER_DETAILS,
  UPDATE_DISTRIBUTER_DETAILS,
  DELETEDISTRIBUTORMANAGEMENTDATA,
} = ApiEndPoint;
export const distributionRegistrationSlice = createSlice({
  name: "distributorregistration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(distributorregisteruser.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(distributorregisteruser.fulfilled, (state, action) => {
        state.DistributorRegisaterData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(distributorregisteruser.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // fetch
      .addCase(fetchDistributorManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchDistributorManagementData.fulfilled, (state, action) => {
        state.DistributorRegisaterData = action.payload.data.distributors;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchDistributorManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // DELETE Distributors
      .addCase(deleteDistributorManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      // .addCase(deleteKitManagementData.fulfilled, (state, action) => {
      //   if (Array.isArray(state.KitManagementData)) {
      //     state.KitManagementData = state.KitManagementData.filter(
      //       (curElm) => !action.payload?.kitIds.includes(curElm._id)
      //     );
      //   }
      //   state.status = StatusCode.IDLE;
      // })
      .addCase(deleteDistributorManagementData.fulfilled, (state, action) => {
        const { payload } = action;
        console.log(payload, "payload");

        state.DistributorRegisaterData = state.DistributorRegisaterData?.filter(
          (curElm) => !action.payload?.distributorIds.includes(curElm._id)
        );
        state.status = StatusCode.IDLE;
      })

      .addCase(deleteDistributorManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = distributionRegistrationSlice.actions;
export default distributionRegistrationSlice.reducer;

export const distributorregisteruser = createAsyncThunk(
  "distributor/user/register",
  async (data) => {
    try {
      const res = await API.post(`${DISTRIBUTORREGISTER}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.status === 200) {
        toast.success(res.data?.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const updateDistributionManagementData = createAsyncThunk(
  "admin/update/user",
  async ({ values, id }) => {
    try {
      const res = await API.put(
        `${UPDATEDISTRIBUTORMANAGEMENTDATA}/${id}`,
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Return the response data
      return res.data;
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);

// Fetch distributor listing
export const fetchDistributorManagementData = createAsyncThunk(
  "admin/get/distributor",
  async () => {
    try {
      const res = await API.get(DISTRIBUTORMANAGEMENT);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch distributor management data:", error);
      throw error;
    }
  }
);

//
export const deleteDistributorManagementData = createAsyncThunk(
  "admin/delete/distributor",
  async (data) => {
    try {
      const res = await API.delete(`${DELETEDISTRIBUTORMANAGEMENTDATA}`, {
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
// get distributor details
export const getDistributorDetails = createAsyncThunk(
  "admin/get-distributor-details",
  async (data) => {
    try {
      const res = await API.get(`${GET_DISTRIBUTER_DETAILS}?id=${data.id}`);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch distributor details:", error);
      throw error;
    }
  }
);
// update distributor details
export const updateDistributorDetails = createAsyncThunk(
  "admin/update-distributor-details",
  async (data) => {
    try {
      const res = await API.put(UPDATE_DISTRIBUTER_DETAILS, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to update distributor details:", error);
      throw error;
    }
  }
);
