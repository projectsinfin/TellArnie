import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  category_classfication_data: [],
  postIncidentData: {},
  form_Data: {
    firstName: { value: "", warning: false },
    lastName: { value: "", warning: false },
    phoneNumberCode: { value: "+44", warning: false },
    phoneNumber: { value: "", warning: false },
    email: { value: "", warning: false },
    category: { value: "", warning: false },
    classification: { value: "", warning: false },
    date: { value: "", warning: false },
    time: { value: "", warning: false },
    summary: { value: "", warning: false },
  },
  quickAddItemFormData: {
    item: { value: "", warning: false },
    quantity: { value: "", warning: false },
    personOfTreatment: { value: "", warning: false },
    productId: "",
    formDataArray: [],
  },

  quichReportData: null,
};
const { GET_CATEGORY_CLASSFICATION, QUICKINCIDENTREPORT } = ApiEndPoint;
export const QuickReport = createSlice({
  name: "QuickReport",
  initialState,
  reducers: {
    setFormDataQuickReport: (state, action) => {
      let data = { ...state };
      data = { ...data, ...data, form_Data: action.payload };
      console.log("data", data);
      return data;
    },
    setFormDataQuickReportItemAdd: (state, action) => {
      let data = { ...state };
      data = { ...data, ...data, quickAddItemFormData: action.payload };
      return data;
    },
    setSearchOperation: (state, action) => {
      state.quichReportData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory_classfication_data.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchCategory_classfication_data.fulfilled, (state, action) => {
        state.category_classfication_data = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchCategory_classfication_data.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // post incident data
      .addCase(quickincidentdata.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(quickincidentdata.fulfilled, (state, action) => {
        state.postIncidentData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(quickincidentdata.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});
export const {
  setFormDataQuickReport,
  setFormDataQuickReportItemAdd,
  setSearchOperation,
} = QuickReport.actions;
export default QuickReport.reducer;
export const fetchCategory_classfication_data = createAsyncThunk(
  "admin/get/kit",
  async () => {
    try {
      const res = await API.get(GET_CATEGORY_CLASSFICATION);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch product management data:", error);
      throw error;
    }
  }
);

export const quickincidentdata = createAsyncThunk(
  "quick/incident/data",
  async (data) => {
    try {
      const res = await API.post(`${QUICKINCIDENTREPORT}`, data);
      if (res.data?.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.data?.message);
    }
  }
);
