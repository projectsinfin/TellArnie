import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  BatchKitsData: {},
  status: StatusCode.IDLE,
};
const { BATCHKITS } = ApiEndPoint;
export const BatchKitsSlice = createSlice({
  name: "Batch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchKitsData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchBatchKitsData.fulfilled, (state, action) => {
        state.BatchKitsData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchBatchKitsData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = BatchKitsSlice.actions;
export default BatchKitsSlice.reducer;

// export const fetchBatchKitsData = createAsyncThunk(
//   "admin/get/batch-kits",
//   async () => {
//     try {
//       const res = await API.get(BATCHKITS);
//       if (res.data?.status === 200) {
//         return res.data;
//       }
//     } catch (error) {
//       console.error("Failed to fetch product management data:", error);
//       throw error;
//     }
//   }
// );
export const fetchBatchKitsData = createAsyncThunk(
  "admin/get/batch-kits",
  async (kitRefId) => { // Accept kit_ref_id as parameter
    try {
      const res = await API.get(`${BATCHKITS}?kit_ref_id=${kitRefId}`); // Pass kit_ref_id as query parameter
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch product management data:", error);
      throw error;
    }
  }
);

