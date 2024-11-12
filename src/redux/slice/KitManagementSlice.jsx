import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  KitManagementData: [],
  PdfKitData: [],
  status: StatusCode.IDLE,
};
const { KITMANAGEMENT, CREATEBATCHKIT ,DELETEKITMANAGEMENTDATA,CREATEMPTYKIT} = ApiEndPoint;
export const KitManagementSlice = createSlice({
  name: "Kitmanagement",
  initialState,
  reducers: {
    setPdfData: (state, action) => {
      state.PdfKitData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKitssManagementData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchKitssManagementData.fulfilled, (state, action) => {
        state.KitManagementData = action.payload.data.kits;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchKitssManagementData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      .addCase(registerBatchKit.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(registerBatchKit.fulfilled, (state, action) => {
        state.KitManagementData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(registerBatchKit.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
        // DELETE KIT
        .addCase(deleteKitManagementData.pending, (state, action) => {
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
        .addCase(deleteKitManagementData.fulfilled, (state, action) => {

          const {payload} = action;
          console.log(payload,"payload")
          
          state.KitManagementData = state.KitManagementData?.filter(
            (curElm) => !action.payload?.kitIds.includes(curElm._id)
          );
          state.status = StatusCode.IDLE;
        })
        
        .addCase(deleteKitManagementData.rejected, (state, action) => {
          state.status = StatusCode.ERROR;
        });
  },
});

export const { setPdfData } = KitManagementSlice.actions;
export default KitManagementSlice.reducer;

export const fetchKitssManagementData = createAsyncThunk(
  "admin/get/kit",
  async () => {
    try {
      const res = await API.get(KITMANAGEMENT);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch product management data:", error);
      throw error;
    }
  }
);

// create batch kits

export const registerBatchKit = createAsyncThunk(
  "create/batch/kit",
  async (data) => {
    try {
      const res = await API.post(`${CREATEBATCHKIT}`, data);
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  }
);
export const registerEmptyKit = createAsyncThunk(
  "create/empty/kit",
  async (data) => {
    try {
      const res = await API.post(`${CREATEMPTYKIT}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  }
);

export const deleteKitManagementData = createAsyncThunk(
  "admin/delete/kit",
  async (data) => {
    try {
      const res = await API.delete(`${DELETEKITMANAGEMENTDATA}`, {
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
