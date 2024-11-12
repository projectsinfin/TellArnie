export const API_BASE_URL = "https://tellarnie.com/api"; //Production url
// export const API_BASE_URL = "https://api.beta.tellarnie.hsvpclubs.com"; //for beta testing

export const getApiUrl = (endpoint) => API_BASE_URL + endpoint;

export const Forget_Password_API = getApiUrl("/forget_password");
export const ResetPassword_API = getApiUrl("/reset_password");
export const LOGIN_API = getApiUrl("/user/login");
export const SIGNUP_API = getApiUrl("/user/signup");
export const OTP_API = getApiUrl("/user/verify_otp");
export const API_RefreshToken = getApiUrl("/user/refresh_token");
export const RegisterCompany_API = getApiUrl("/company/register");
export const RegisterApprovalOffice_API = getApiUrl(
  "/company/register_approver_officer"
);

export const Profile_API = getApiUrl("/user/my_account");
export const ManageUser_API = getApiUrl("/admin/get_users");

export const InstallKitDetails_API = getApiUrl("/admin/fetch_kit_details?");
export const EnterManuallyKit_API = getApiUrl("/admin/add_product");
export const NotFoundKit_API = getApiUrl("/admin/register_kit");
export const GetLocation_API = getApiUrl("/admin/fetch_location");
export const AddLocation_API = getApiUrl("/admin/add_kit_location");

export const GetIncidentCategory_API = getApiUrl("/incident_categories");
export const GetPersonOfTreatment_API = getApiUrl("/admin/get_users");
export const QuickIncident_API = getApiUrl("/admin/add_quick_incident");
export const DetailIncident_API = getApiUrl("/admin/add_detailed_incident");

// Admin screen api
export const AdminDeashboard_API = getApiUrl("/admin/fetch_dashboard_details");
export const AdminAddLocation_API = getApiUrl("/admin/add_location");
export const UpdateLocation_API = getApiUrl("/admin/update_location/");

export const AdminCompanyDetail_API = getApiUrl("/admin/fetch_location");
// export const AdminCompanyDetail_API = getApiUrl("/admin/fetch_location_test");
export const DeleteSalesUser_API = getApiUrl("/admin/delete_user/");

export const AdminApprover_API = getApiUrl("/admin/get_approver");
export const IncidentDetail_API = getApiUrl("/admin/incidents");
export const IncidentAllDetails_API = getApiUrl("/admin/incident/");
export const AdminRegisterUser_API = getApiUrl("/admin/register_user");
export const ScanBarcodeItem_API = getApiUrl("/admin/product");
export const KisStatus_API = getApiUrl("/admin/fetch_location_kits");
export const KisStatus_details_API = getApiUrl(
  "/admin/fetch_location_kit_details"
);

export const UpdateProduct_API = getApiUrl("/admin/update_product?productId=");
export const UpdateProfile_API = getApiUrl("/user/update_profile");
export const Edit_business_details_API = getApiUrl(
  "/admin/edit_business_profile_app"
);

export const ShowMessage_API = getApiUrl("/admin/get_user_notifcations");
export const DetailsMessage_API = getApiUrl("/admin/get_user_notifcation/");
export const DeleteProfilePic_API = getApiUrl("/admin/delete_profile_pic");
export const update_risk_assessment = getApiUrl(
  "/admin/update_risk_assessment"
);
export const generate_quote = getApiUrl("/admin/generate_quote");
export const productList = getApiUrl("/admin/fetch_products");
export const approve_user = getApiUrl("/admin/approve_user");
export const get_kit_pictures = getApiUrl("/admin/get_kit_pictures");

export const get_UserInfo = getApiUrl("/admin/get_user_by_id/");
export const delete_kit = getApiUrl("/admin/delete_product?id=");
export const edit_UserDetails = getApiUrl("/admin/edit_user_details");
export const delete_user_API = getApiUrl("/admin/delete_user_by_id?id=");
export const delete_location_API = getApiUrl(
  "/admin/delete_location_by_id?id="
);

export const delete_Kit_API = getApiUrl("/admin/delete_kit_by_id?id=");
export const News_Update_API = getApiUrl("/admin/get_newsupdate");
