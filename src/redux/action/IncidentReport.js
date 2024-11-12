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
      
      const response = await makeFormDataRequest(
        DetailIncident_API,
        "post",
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_IncidentCategory_Api = createAsyncThunk(
  "getIncidentCategory",
  async (credentials, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.get(GetIncidentCategory_API);
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
      const response = await axiosInstance.get(GetPersonOfTreatment_API);
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
      const response = await axiosInstance.post(QuickIncident_API, credentials);
 
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
    
      if (credentials === undefined) {
        const response = await axiosInstance.get(IncidentDetail_API);
        return response.data;
      }
      const response = await axiosInstance.get(
        IncidentAllDetails_API + credentials
      );
      
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
     
      const response = await axiosInstance.get(
        `${IncidentDetail_API}?search=${credentials.search}&start_date=${credentials.start_date}&end_date=${credentials.end_date}`
      );

      
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
     
      const paramVal =
        credentials?.kitId !== ""
          ? `?barcode=${credentials?.barcode}&kit_id=${credentials?.kitId}`
          : `?barcode=${credentials?.barcode}`;

      const response = await axiosInstance.get(ScanBarcodeItem_API + paramVal);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
