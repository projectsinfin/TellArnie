import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../services/api";
import { ApiEndPoint, StatusCode } from "../../services/helper";

const initialState = {
  ExportFileData: {},
  status: StatusCode.IDLE,
};

const { EXPORTFILES ,EXPORTUSERS, EXPORTDIST,EXPORTKITS} = ApiEndPoint;

export const createexportfile = createAsyncThunk(
  "create/export/file",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EXPORTFILES}`, data, { responseType: 'blob' });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.csv'); // or any other file name
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("File exported successfully.");
        return res.data;
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);
// export users


export const createexportUsers = createAsyncThunk(
  "create/export/users",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EXPORTUSERS}`, data, { responseType: 'blob' });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv'); // or any other file name
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("File exported successfully.");
        return res.data;
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createexportDistributors = createAsyncThunk(
  "create/export/distributors",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EXPORTDIST}`, data, { responseType: 'blob' });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'distributors.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("File exported successfully.");
        return res.data;
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createexportKits = createAsyncThunk(
  "create/export/kits",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EXPORTKITS}`, data, { responseType: 'blob' });
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'kits.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("kits exported successfully.");
        return res.data;
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);
export const exportFileSlice = createSlice({
  name: "exportfileslice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createexportfile.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(createexportfile.fulfilled, (state, action) => {
        state.ExportFileData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(createexportfile.rejected, (state) => {
        state.status = StatusCode.ERROR;
      })

      // EXPORT USERS
      .addCase(createexportUsers.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(createexportUsers.fulfilled, (state, action) => {
        state.ExportFileData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(createexportUsers.rejected, (state) => {
        state.status = StatusCode.ERROR;
      })
      // EXPORT DISTRIBUTORS
        .addCase(createexportDistributors.pending, (state) => {
          state.status = StatusCode.LOADING;
        })
        .addCase(createexportDistributors.fulfilled, (state, action) => {
          state.ExportFileData = action.payload;
          state.status = StatusCode.IDLE;
        })
        .addCase(createexportDistributors.rejected, (state) => {
          state.status = StatusCode.ERROR;
        })
          // EXPORT Kits
          .addCase(createexportKits.pending, (state) => {
            state.status = StatusCode.LOADING;
          })
          .addCase(createexportKits.fulfilled, (state, action) => {
            state.ExportFileData = action.payload;
            state.status = StatusCode.IDLE;
          })
          .addCase(createexportKits.rejected, (state) => {
            state.status = StatusCode.ERROR;
          });
  },
});

export default exportFileSlice.reducer;