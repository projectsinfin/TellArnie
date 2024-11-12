export const ApiUrl = process.env.REACT_APP_BASEURL;
export const StatusCode = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
};

export const asignRoles = [
  {
    label: "Super Admin",
    value: "rm_superadmin",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Approver",
    value: "approver",
  },
  {
    label: "User",
    value: "user",
  },
  {
    label: "Sales Executive",
    value: "salesrepresentative",
  },
];
export const asignDistributorRoles = [
  {
    label: "Super Admin",
    value: "distributor_superadmin",
  },

  {
    label: "Sales Executive",
    value: "salesrepresentative",
  },
];
export const userPermissions = [
  {
    column: "col-4",
    type: "switch",
    id: "Manage Products",
    label: "Manage Products",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Manage Company Users",
    label: "Manage Company Users",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Manage Business Profile",
    label: "Manage Business Profile",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Manage Distributors",
    label: "Manage Distributors",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Manage Resource Center",
    label: "Manage Resource Center",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Receive Update Notifications",
    label: "Receive Update Notifications",
  },
];

export const userPermissionsDistributor = [
  {
    column: "col-4",
    type: "switch",
    id: "Manage Company Users",
    label: "Manage  Users",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Manage Business Profile",
    label: "Manage Business Profile",
  },
  {
    column: "col-4",
    type: "switch",
    id: "Manage Distributors",
    label: "Manage Clients",
  },

  {
    column: "col-4",
    type: "switch",
    id: "Receive Update Notifications",
    label: "Receive Notifications",
  },
];
export const ApiEndPoint = {
  LOGIN: "/admin/login",
  DISTRIBUTORREGISTER: "/admin/create_distributor",
  DISTRIBUTORQR:"/admin/download_qr_code",
  AUTHUSER: "/user/my_account",
  USERMANAGEMENT: "/admin/get_users",
  PRODUCTMANAGEMENT: "/admin/fetch_products",
  KITMANAGEMENT: "/admin/fetch_kits",
  ADMINFETCHLOCATION: "/admin/fetch_location",
  CREATENEWUSER: "/admin/register_user",
  REFRESHTOKEN: "/user/refresh_token",
  DISTRIBUTORMANAGEMENT: "/admin/fetch_distributor",
  BUSINESSPROFILE: "/admin/fetch_location",
  MESSAGECENTRE: "/admin/get_messages",
  ARTICLEREGISTRATION: "/admin/create_article",
  NOTIFICATIONREGISTRATION: "/admin/create_notification",
  SUPERADMINAPPROVERDATA: "/admin/get_approver",
  BUSINESSPROFILEFORM: "/admin/fetch_business_details",
  UPDATEBUSINESSPROFILE: "/admin/edit_business_details",
  ADDLOCATION: "/admin/add_location",
  DASHBOARDLISTING: "/admin/web_dashboard_details",
  REPORTSLISTING: "/admin/fetch_report_group",
  CREATEGROUPREPORT: "/admin/create_report_group",
  CREATEREPORT: "/admin/create_report",
  REPORTSDATA: "/admin/get_reportData_list",
  CREATEBATCHKIT: "/admin/register_batch_kit",
  CREATEMPTYKIT:"/admin/register_empty_kit",
  USERMANAGEMENTDATABYID: "/admin/get_user_by_id",
  UPDATEUSERMANAGEMENTDATA: "/admin/update_user_profile",
  DELETEUSERMANAGEMENTDATA: "/admin/delete_user",
  REPORTS: "/admin/fetch_reports",
  DISTRIBUTORCLIENTMANAGEMENT: "/admin/get_clients",
  DELETEREPORTGROUPDATA:"/admin/delete_report_group_by_id",
  DELETEREPORTLISTDATA:"/admin/delete_reports",
  UPDATE_GROUP_DETAILS:"/admin/update_report_group_by_id",
  GROUPDATABYID:"/admin/get_report_group_by_id",
  REPORTDATABYID:"/admin/get_report_by_id",
  UPDATE_REPORT_DETAILS:"/admin/update_report_by_id",
  INVITE: "/admin/send_invitation_mail",
  // endpoint for import files
  IMPORTPRODUCT: "/admin/import_products",
  IMPORTUSER: "/admin/import_users",
  IMPORTDISTRIBUTOR: "importdistributordata",
  GET_CATEGORY_CLASSFICATION: "/admin/incident_categories",
  QUICKINCIDENTREPORT: "/admin/web_quick_incident",
  QUICKDETAILEDINCIDENTREPORT: "/admin/web_detailed_incident",
  BATCHKITS: "/admin/fetch_kit_products",
  MESSAGECENTREDATAID: "/admin/get_message_by_id",
  UPDATEARTICAL: "/admin/update_article_by_id",
  UPDATENOTIFICATION: "/admin/update_notification_by_id",
  DELETEKITMANAGEMENTDATA: "/admin/delete_kits",
  DELETEDISTRIBUTORMANAGEMENTDATA: "/admin/delete_distributor",
  DELETEMESSAGECENTERDATA: "/admin/delete_messages",
  GET_DISTRIBUTER_DETAILS: "/admin/get_distributor_by_id",
  UPDATE_DISTRIBUTER_DETAILS: "/admin/update_distributor",
  DELETEPRODUCTMANAGEMENTDATA:"",
  EXPORTFILES:"/admin/export_products",
  EXPORTUSERS:"/admin/export_users",
  EXPORTDIST:"/admin/export_distributors",
  EXPORTKITS:"/admin/export_registered_kits",  // Distributor dashboard
  DISTRUBUTORDASHBOARD: "/admin/distributor_dashboard_details",
  DELETELOCATIONDATA: "/admin/delete_location",
  UPDATELOCATIONDATA: "/admin/update_location",
  UPDATEDISTRIBUTORMANAGEMENTDATA: "",
};
