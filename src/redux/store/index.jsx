import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "../slice/LoginSlice";
import AuthReducer from "../slice/AuthSlice";
import DistributorReducer from "../slice/DistributionRegistrationSlice";
import UserManagementReducer from "../slice/UserManagementSlice";
import CreateUserReducer from "../slice/CreateNewUserSlice";
import ProductManagementReducer from "../slice/ProductManagementSlice";
import KitManagementReducer from "../slice/KitManagementSlice";
import DistributorManagementReducer from "../slice/DistributionRegistrationSlice";
import BusinessProfileReducer from "../slice/BusinessProfileSlice";
import MessageCentreReducer from "../slice/MessageCentreSlice";
import SuperAdminApproverDataReducer from "../slice/CreateLocationSlice";
import UserProfileReducer from "../slice/UserProfileSlice";
import DashboardListingReducer from "../slice/DashboardListingSlice";
import ReportsListingReducer from "../slice/ReportsListingSlice";
import CreateNewReportReducer from "../slice/CreateReportSlice";
import CreateReportReducer from "../slice/CreateReportGroupSlice";
import CreateReportsdataReducer from "../slice/AddtoReportSlice";
import ImportFileReducer from "../slice/ImportFileSlice";
import QuickReportReducer from "../slice/QuickReportSlice";
import DetailReportReducer from "../slice/DetailReportSummarySlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
 
import ClientListingReducer from "../slice/ClientsDistributorSlice";
import BatchKitsReducer from "../slice/BatchKits";
import DistributorDashboardReducer from "../slice/DistributorDashboardSlice"
import ExportFilesReducer from "../slice/ExportFileSlice"
import ReportsListingDataReducer from"../slice/ReportsSlice";
import DistributorQRReducer from "../slice/DistributorQrSlice"


const persisitConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  LOGIN: LoginReducer,
  AUTH: AuthReducer,
  DISTRIBUTORREGISTRATION: DistributorReducer,
  USERMANAGEMENT: UserManagementReducer,
  PRODUCTMANAGEMENT: ProductManagementReducer,
  KITMANAGEMENT: KitManagementReducer,
  CREATEUSERANDLOCATION: CreateUserReducer,
  DISTRIBUTORMANAGEMENT: DistributorManagementReducer,
  BUSINESSPROFILE: BusinessProfileReducer,
  MESSAGECENTRE: MessageCentreReducer,
  SUPERADMINAPPROVER: SuperAdminApproverDataReducer,
  BUSINESSPROFILEFORM: UserProfileReducer,
  DASHBOARDLISTING: DashboardListingReducer,
  REPORTSLISTING: ReportsListingReducer,
  REPORTSLISTINGDATA: ReportsListingDataReducer,

  CREATEREPORT: CreateReportReducer,
  CREATENEWREPORT: CreateNewReportReducer,
  REPORTSDATA: CreateReportsdataReducer,
  IMPORTFILES: ImportFileReducer,
  QUICKREPORT: QuickReportReducer,
  DetailReport: DetailReportReducer,
  DISTRIBUTORCLIENTMANAGEMENT:ClientListingReducer,
  BATCHKITS :BatchKitsReducer,
  DISTRUBUTORDASHBOARD: DistributorDashboardReducer,
  EXPORTFILES: ExportFilesReducer,
  DISTRIBUTORQR: DistributorQRReducer,

  

});

const persistedReducer = persistReducer(persisitConfig, reducer);
const store = configureStore({
  reducer: persistedReducer,
});

export default store;
