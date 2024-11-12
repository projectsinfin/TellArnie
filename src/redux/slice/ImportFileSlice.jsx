import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StatusCode } from "../../services/helper";
import { toast } from "react-toastify";
import API from "../../services/api";
const initialState = {
  ImportFileData: {},
  status: StatusCode.IDLE,
};
export const importFileSlice = createSlice({
  name: "importfileslice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //  case for create user
      .addCase(createImportfile.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(createImportfile.fulfilled, (state, action) => {
        state.ImportFileData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(createImportfile.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = importFileSlice.actions;
export default importFileSlice.reducer;

export const createImportfile = createAsyncThunk(
  "create/import/file",
  async (data) => {
    const url = data.url;
    try {
      const res = await API.post(`${url}`, data.value, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res, "res from slice");
      return res.data;
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }
);
