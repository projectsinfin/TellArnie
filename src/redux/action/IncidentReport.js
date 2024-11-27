import {
  DetailIncident_API,
  GetIncidentCategory_API,
  GetPersonOfTreatment_API,
  IncidentDetail_API,
  IncidentAllDetails_API,
  QuickIncident_API,
  ScanBarcodeItem_API,
} from "../../config/urls";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance, { makeFormDataRequest } from "../../utils/services";

export const call_AddDetailIncident = createAsyncThunk(
  "addDetailIncident",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log("***** addDetailIncident", JSON.stringify(formData));
      const response = await makeFormDataRequest(
        DetailIncident_API,
        "post",
        formData
      );
      // console.log("response***** addDetailIncident", response);
      return response.data;
    } catch (error) {
      console.log("error***** addDetailIncident", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_IncidentCategory_Api = createAsyncThunk(
  "getIncidentCategory",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** GetIncidentCategory_API", credentials);
      const response = await axiosInstance.get(GetIncidentCategory_API);
      // console.log("response***** GetIncidentCategory_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_PersonOftreatment_Api = createAsyncThunk(
  "PersonOftreatment",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** PersonOftreatment", credentials);
      const response = await axiosInstance.get(GetPersonOfTreatment_API);
      // console.log("response***** PersonOftreatment", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_QuickIncident_Api = createAsyncThunk(
  "quickIncident_Api",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****add QuickIncident_API", credentials);
      const response = await axiosInstance.post(QuickIncident_API, credentials);
      // console.log("response***** QuickIncident_API", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_IncidentDetail_API = createAsyncThunk(
  "incidentDetail_API",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** incidentDetail_API", credentials);
      if (credentials === undefined) {
        const response = await axiosInstance.get(IncidentDetail_API);
        return response.data;
      }
      const response = await axiosInstance.get(
        IncidentAllDetails_API + credentials
      );
      // console.log("response***** incidentDetail_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_Searchbar_API = createAsyncThunk(
  "Searchbar_API",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log(
        `${IncidentDetail_API}?search=${credentials.search}&start_date=${credentials.start_date}&end_date=${credentials.end_date}`,
        "requestttttttt"
      );
      const response = await axiosInstance.get(
        `${IncidentDetail_API}?search=${credentials.search}&start_date=${credentials.start_date}&end_date=${credentials.end_date}`
      );

      // console.log("response***** Searchbar_API", response.payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_ScanBarcodeItem_API = createAsyncThunk(
  "ScanBarcodeItem",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** ScanBarcodeItem_API", credentials);
      const paramVal =
        credentials?.kitId !== ""
          ? `?barcode=${credentials?.barcode}&kit_id=${credentials?.kitId}`
          : `?barcode=${credentials?.barcode}`;

      const response = await axiosInstance.get(ScanBarcodeItem_API + paramVal);
      console.log("response***** ScanBarcodeItem_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
