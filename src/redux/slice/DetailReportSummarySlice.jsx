import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  getBarCodeData: {},
  status: StatusCode.IDLE,
  detailIncedentRegisterData: {},
  detailFromInfoFormData: {
    firstName: { value: "", warning: false },
    lastName: { value: "", warning: false },
    phoneNumberCode: { value: "44", warning: false },
    phoneNumber: { value: "", warning: false },
    email: { value: "", warning: false },
  },
  detailReportSummaryFormData: {
    category: { value: "", warning: false },
    classification: { value: "", warning: false },
    date: { value: "", warning: false },
    time: { value: "", warning: false },
    summary: { value: "", warning: false },
    locationOfIncident: { value: "", warning: false },
    areaOfIncident: { value: "", warning: false },
  },
  detailReportActionData: {
    personOfTreatment: { value: "", warning: false },
    injuryClassification: { value: "", warning: false },
    injuryType: { value: "", warning: false },
    injuryDetail: { value: "", warning: false },
    incidentOutcome: { value: "", warning: false },
    otherDetail: { value: "", warning: false },
    formArr: [],
  },
  detailReportFilledItem: {
    item: { value: "", warning: false },
    quantity: { value: "", warning: false },
    usedBy: { value: "", warning: false },
    formDataArray: [],
  },
};
const { QUICKDETAILEDINCIDENTREPORT } = ApiEndPoint;
export const DetailSummarayReport = createSlice({
  name: "DetailSummarayReport",
  initialState,
  reducers: {
    setdetailFromInfoFormData: (state, action) => {
      let data = { ...state };
      data = { ...data, ...data, detailFromInfoFormData: action.payload };
      console.log("data", data);
      return data;
    },
    setdetailReportSummaryFormData: (state, action) => {
      let data = { ...state };
      data = { ...data, ...data, detailReportSummaryFormData: action.payload };
      console.log("data", data);
      return data;
    },
    setdetailReportActionData: (state, action) => {
      let data = { ...state };
      data = { ...data, ...data, detailReportActionData: action.payload };
      console.log("data", data);
      return data;
    },
    setdetailReportFilledItem: (state, action) => {
      let data = { ...state };
      data = { ...data, ...data, detailReportFilledItem: action.payload };
      console.log("data", data);
      return data;
    },
  },
  extraReducers: (builder) => {
    builder
      //   getbar code data
      .addCase(fetchBarCodeScaanerDetail.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchBarCodeScaanerDetail.fulfilled, (state, action) => {
        state.getBarCodeData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchBarCodeScaanerDetail.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })

      //   detail incident register
      .addCase(detailedincidentregister.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(detailedincidentregister.fulfilled, (state, action) => {
        state.detailIncedentRegisterData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(detailedincidentregister.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});
export const {
  setdetailFromInfoFormData,
  setdetailReportSummaryFormData,
  setdetailReportActionData,
  setdetailReportFilledItem,
} = DetailSummarayReport.actions;
export default DetailSummarayReport.reducer;

export const fetchBarCodeScaanerDetail = createAsyncThunk(
  "admin/get/fetchBarCodeScaanerDetail",
  async (Barid) => {
    try {
      const res = await API.get(`/admin/product/${Barid}`);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch product management data:", error);
      throw error;
    }
  }
);

export const detailedincidentregister = createAsyncThunk(
  "detail/incident/data",
  async (data) => {
    try {
      const res = await API.post(QUICKDETAILEDINCIDENTREPORT, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.status === 200) {
        toast.success(res.data?.message);
      }
      return res.data;
    } catch (error) {
      // toast.error(error.data?.message);
      toast.success(error.message);
    }
  }
);
