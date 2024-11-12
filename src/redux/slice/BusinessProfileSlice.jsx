import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";

const initialState = {
  BusinessProfileData: {
    locations:[]
  },
  status: StatusCode.IDLE,
};

const { BUSINESSPROFILE, DELETELOCATIONDATA, UPDATELOCATIONDATA } = ApiEndPoint;

export const BusinessProfileSlice = createSlice({
  name: "Businessprofile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Business Profile Data
      .addCase(fetchBusinessProfileData.fulfilled, (state, action) => {
        console.log(action.payload,"action.payload")
        state.BusinessProfileData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchBusinessProfileData.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchBusinessProfileData.rejected, (state) => {
        state.status = StatusCode.ERROR;
      })
      // Update Location Data
      // .addCase(updateLocationData.pending, (state) => {
      //   state.status = StatusCode.LOADING;
      // })
      // .addCase(updateLocationData.fulfilled, (state) => {
      //   state.status = StatusCode.IDLE;
      // })
      // .addCase(updateLocationData.rejected, (state) => {
      //   state.status = StatusCode.ERROR;
      // })
      .addCase(updateLocationData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(updateLocationData.fulfilled, (state, action) => {
        state.BusinessProfileData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(updateLocationData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // Delete Location Data
      .addCase(deleteLocationData.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(deleteLocationData.fulfilled, (state, action) => {
        const deletedLocationId = action.payload;
        // Filter out the deleted location from BusinessProfileData
        state.BusinessProfileData = {
          ...state.BusinessProfileData,
          locations:state?.BusinessProfileData?.locations.filter(
            (location) => location._id !== deletedLocationId
          )
        }
        state.status = StatusCode.IDLE;
      })
      .addCase(deleteLocationData.rejected, (state) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export default BusinessProfileSlice.reducer;

export const fetchBusinessProfileData = createAsyncThunk(
  "admin/get/businessprofile",
  async () => {
    try {
      const res = await API.get(BUSINESSPROFILE);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch BUSINESSPROFILE data:", error);
      throw error;
    }
  }
);

// export const updateLocationData = createAsyncThunk(
//   "admin/update/businessprofile",
//   async ({ values, id }) => {
//     try {
//       const res = await API.put(`${UPDATELOCATIONDATA}?id=${id}`, values, {
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
export const updateLocationData = createAsyncThunk(
  "admin/update/businessprofile",
async ({ id, data }) => {
    try {
      const res = await API.put(`${UPDATELOCATIONDATA}?id=${id}`, data);
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  }
);

// export const updateLocationData = createAsyncThunk(
//   "admin/update/businessprofile",
//   async ({ values, id }) => {
//     try {
//       const res = await API.put(`${UPDATELOCATIONDATA}?id=${id}`, values, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       // Handle response if needed
//     } catch (error) {
//       toast.error(error.data?.message);
//       throw error;
//     }
//   }
// );




export const deleteLocationData = createAsyncThunk(
  "admin/delete/businessprofile",
  async (id) => {
    try {
      const res = await API.delete(`${DELETELOCATIONDATA}?id=${id}`);
      if (res.status === 200) {
        toast.success(res?.data?.message);
        return id;
      }
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);
