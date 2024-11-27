import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AdminAddLocation_API,
  AdminApprover_API,
  AdminCompanyDetail_API,
  AdminDeashboard_API,
  AdminRegisterUser_API,
  DeleteSalesUser_API,
  Edit_business_details_API,
  News_Update_API,
  UpdateLocation_API,
  approve_user,
  delete_Kit_API,
  delete_kit,
  delete_location_API,
  delete_user_API,
  edit_UserDetails,
  generate_quote,
  get_UserInfo,
  get_kit_pictures,
  productList,
  update_risk_assessment,
} from "../../config/urls";
import axiosInstance, {
  makeFormDataRequest,
  makeFormDataRequests,
} from "../../utils/services";

export const call_AdminDeashboard_API = createAsyncThunk(
  "AdminDeashboard_API",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** AdminDeashboard_API", credentials);
      const response = await axiosInstance.get(AdminDeashboard_API);
      // console.log("response***** AdminDeashboard_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AdminAddLocation = createAsyncThunk(
  "adminAddLocation",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** adminAddLocation", credentials);
      const response = await axiosInstance.post(
        AdminAddLocation_API,
        credentials
      );
      // console.log("response***** adminAddLocation", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_UpdateLocation = createAsyncThunk(
  "UpdateLocation_API",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** UpdateLocation_API", credentials);
      const response = await axiosInstance.put(UpdateLocation_API, credentials);
      // console.log("response***** UpdateLocation_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_Edit_business_details = createAsyncThunk(
  "Edit_business_details",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** Edit_business_details_API", credentials);
      const response = await axiosInstance.put(
        Edit_business_details_API,
        credentials
      );
      // console.log("response***** Edit_business_details_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AdminCaompanyDetail = createAsyncThunk(
  "adminCaompanyDetail",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** adminCaompanyDetail", credentials);
      const response = await axiosInstance.get(AdminCompanyDetail_API);
      // console.log("response***** adminCaompanyDetail", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_DeleteSalesUser_API = createAsyncThunk(
  "DeleteSalesUser_API",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** DeleteSalesUser_API", credentials);
      const response = await axiosInstance.delete(
        DeleteSalesUser_API + credentials
      );
      console.log("response***** DeleteSalesUser_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AdminApprover = createAsyncThunk(
  "adminApprover",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** AdminApprover", credentials);
      const response = await axiosInstance.get(AdminApprover_API);
      // console.log("response***** AdminApprover", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AdminRegisterUser_API = createAsyncThunk(
  "adminRegisterUser",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log("***** AdminRegisterUser_API", JSON.stringify(formData));
      const response = await makeFormDataRequest(
        AdminRegisterUser_API,
        "post",
        formData
      );
      // console.log("response***** AdminRegisterUser_API", response);
      return response.data;
    } catch (error) {
      // console.log("error***** AdminRegisterUser_API", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_update_risk_assessment = createAsyncThunk(
  "update_risk_assessment",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** update_risk_assessment", credentials);
      const response = await axiosInstance.post(
        update_risk_assessment,
        credentials
      );
      // console.log("response***** update_risk_assessment", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_generate_quote = createAsyncThunk(
  "generate_quote",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** generate_quote", credentials);
      const response = await axiosInstance.post(generate_quote, credentials);
      // console.log("response***** generate_quote", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_productList = createAsyncThunk(
  "generate_quote",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** productList", credentials);
      const response = await axiosInstance.get(productList);
      // console.log("response***** productList", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_approve_user = createAsyncThunk(
  "approve_user",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** approve_user", credentials);
      const response = await axiosInstance.post(approve_user, credentials);
      // console.log("response***** approve_user", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_get_kit_pictures = createAsyncThunk(
  "get_kit_pictures",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** get_kit_pictures", credentials);
      const response = await axiosInstance.post(get_kit_pictures, credentials);
      // console.log("response***** get_kit_pictures", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_get_UserInfo = createAsyncThunk(
  "get_UserInfo",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** get_UserInfo", credentials);
      const response = await axiosInstance.get(get_UserInfo + credentials);
      // console.log("response***** get_UserInfo", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_delete_kit = createAsyncThunk(
  "delete_kit",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** delete_kit", credentials);
      const response = await axiosInstance.delete(delete_kit + credentials);
      // console.log("response***** delete_kit", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_edit_UserDetails = createAsyncThunk(
  "edit_UserDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await makeFormDataRequest(
        edit_UserDetails,
        "put",
        formData
      );

      return response.data;
    } catch (error) {
      console.log("err edit_UserDetails", error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_EditUser_API = createAsyncThunk(
  "EditUser_API",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** call_EditUser_API", credentials);
      const response = await axiosInstance.delete(
        delete_user_API + credentials
      );
      // console.log("response***** call_EditUser_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_delete_location_API = createAsyncThunk(
  "delete_location_API",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** delete_location_API", credentials);
      const response = await axiosInstance.delete(
        delete_location_API + credentials
      );
      // console.log("response***** delete_location_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_delete_Kit_API = createAsyncThunk(
  "delete_Kit_API",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** delete_Kit_API", credentials);
      const response = await axiosInstance.delete(delete_Kit_API + credentials);
      console.log("response***** delete_Kit_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_News_Update_API = createAsyncThunk(
  "News_Update_API",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("***** News_Update_API", credentials);
      const response = await axiosInstance.get(News_Update_API);
      console.log("response***** News_Update_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
