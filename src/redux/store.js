import { getDefaultMiddleware, configureStore } from "@reduxjs/toolkit";
// import {counterSlice} from './reducer/counterSlice';
import counterReducer from "./reducer/counterSlice";
import auth from "./reducer/auth";
import authReducer from "./reducer/authSlice";
import Profile from "./reducer/ProfileSlice";
import InstallKitsSlice from "./reducer/InstallKitsSlice";
import incidentCategoryDetails from "./reducer/IncidentSlice";
import kistStatusSlice from "./reducer/ManageKistSlice";
import EditUserInfoSlice from "./reducer/EditUserInfoSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auths: authReducer,
    profileData: Profile,
    InstallKitsSliceDetail: InstallKitsSlice,
    incidentCategory: incidentCategoryDetails,
    kitStatus: kistStatusSlice,
    auth,
    editUserDetails: EditUserInfoSlice,
  },
});
