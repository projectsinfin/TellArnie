import ProtectedRoute from "../components/Common/ProtectedRoute";
import BusinessProfile from "../pages/BusinessProfile";
import Dashboard from "../pages/Dashboard/Dashboard";
import Distributor from "../pages/Distributors/Distributor";
import Kits from "../pages/KitManagement/Kits";
import EditArticle from "../pages/MessageCentre/EditArticle/EditArticle";
import EditNotification from "../pages/MessageCentre/EditNotification/EditNotification";
import MessageCentre from "../pages/MessageCentre/MessageCentre";
import Notifications from "../pages/Notifications/Notification";
import Products from "../pages/Products/Products";
import ReportEditor from "../pages/ReportManagement/ReportEditor";
import Reports from "../pages/ReportManagement/Reports";
import Resource from "../pages/ResourceManagement/Resource";
import CreateUser from "../pages/UserManagement/CreateUser/CreateUser";
import UserManagement from "../pages/UserManagement/UserManagement/UserManagent";
import Users from "../pages/UserManagement/Users";
import Layout from "../layout";
import PublicRoute from "../components/Common/PublicRoute";
import DistributorInformation from "../pages/Distributors/DistributorInformation";
import CreateGroupReport from "../pages/ReportManagement/CreateGroupReport";
import CreateLocation from "../pages/BusinessProfile/CreateLocation";
import UpdateUser from "../pages/UserManagement/UpdateUser";
import CreateKit from "../pages/KitManagement/CreateKit";
import UploadComponentpic from "../pages/Products/ImportProducts/screen1";
import UploadComponentData from "../pages/Products/ImportProducts/screen2";
import ImportDuplicates from "../pages/Products/ImportProducts/screen3";
import ImportSummary from "../pages/Products/ImportProducts/screen4";
import GeneratePdfKit from "../components/GeneratePdfKit";
import WithOutLoginData from "../pages/WithoutLoginData";
import DistributorDashboard from "../pages/DistributorSuperAdmin/DistributorDashboard";
import DistributorUsermanagement from "../pages/DistributorSuperAdmin/DistributorUsermanagement";
import DistributorBusinessProfile from "../pages/DistributorSuperAdmin/DistributorBusinessProfile";
import DistributorClients from "../pages/DistributorSuperAdmin/DistributorClients";
import DistributorNotification from "../pages/DistributorSuperAdmin/DistributorNotification";
import DistributorCreateUser from "../pages/DistributorSuperAdmin/DistributorCreateUser";
import Login from "../pages/Login";
import ImportCsvFiles from "../pages/ImportCsvFiles";
import ExportCsvFiles from "../pages/ExportCsvFiles";
import MultipleFileUpload from "../pages/MultipleFileUpload";
import OnlineQuickPageOne from "../pages/WithoutLoginData/QuickReportPages/OnlineQuickPageOne";
import OnlineQuickPageTwo from "../pages/WithoutLoginData/QuickReportPages/OnlineQuickPageTwo";
import OnlineQuickPageThree from "../pages/WithoutLoginData/QuickReportPages/OnlineQuickPageThree";
import QuickReportPagesLayout from "../pages/WithoutLoginData/QuickReportPages";
import DetailedReportPageOne from "../pages/WithoutLoginData/QuickReportPages/DetailedReportPageOne";
import DetailedReportSummary from "../pages/WithoutLoginData/QuickReportPages/DetailedReportSummary";
import DetailedReportTakeAction from "../pages/WithoutLoginData/QuickReportPages/DetailedReportTakeAction";
import StandardWithQuickReport from "../pages/WithoutLoginData/QuickReportPages/StandardWithQuickReport";
import DetailedReportForItem from "../pages/WithoutLoginData/QuickReportPages/DetailedReportForItem";
import DetailedReportFilledItem from "../pages/WithoutLoginData/QuickReportPages/DetailedReportFilledItem";
import DetailedIncidentReportSummary from "../pages/WithoutLoginData/QuickReportPages/DetailedIncidentReportSummary";
import DistributorInviteAdmin from "../pages/DistributorSuperAdmin/DistributorInviteAdmin";
import { permissions } from "../utils/helperFunction";
import CreateDistributionLocation from "../pages/DistributorSuperAdmin/DistributorBusinessProfile/DistributorCreateLocation";
import UpdateDistributor from "../pages/Distributors/Updatedistribtors";
import DistributorUpdateUser from "../pages/DistributorSuperAdmin/DistributorUpdateUser";
import UpdateGroupReport from "../pages/ReportManagement/UpdateGroupReport";
import UpdateReportEditor from "../pages/ReportManagement/ReportEditor/UpdateListingReport";
import SuccessIncidentPage from "../pages/WithoutLoginData/QuickReportPages/SuccessPage";
import CreateEmptyKit from "../pages/KitManagement/CreateEmptyKit";
import GenerateExcelKit from "../components/GeneratePdfKit/generateExcel";
import DistQR from "../pages/DistributorSuperAdmin/DistributorQR";

const {
  all,
  products,
  users,
  business,
  distributors,
  resource,
  notifications,
  dist_superadmin,
} = permissions;

const privateType = "private";
const publicType = "public";

const RouterData = [
  {
    type: privateType,
    path: "/",
    element: (
      <ProtectedRoute
        permission={[all, products, users, business, distributors, resource]}
      >
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: publicType,
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    type: publicType,
    path: "/verify_email",
    element: <PublicRoute>{/* <Login /> */}</PublicRoute>,
  },
  {
    type: privateType,
    path: "/users",
    element: (
      <ProtectedRoute permission={[all, users]}>
        <Layout>
          <Users />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/products",
    element: (
      <ProtectedRoute permission={[all, products]}>
        <Layout>
          <Products />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/kit",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <Kits />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    path: "/createkit",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <CreateKit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/createemptykit",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <CreateEmptyKit/>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/messaging",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <MessageCentre />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/editarticle",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <EditArticle />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/businessprofile",
    element: (
      <ProtectedRoute permission={[all, business]}>
        <Layout>
          <BusinessProfile />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/edit-notification",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <EditNotification />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/resource",
    element: (
      <ProtectedRoute permission={[all, resource]}>
        <Layout>
          <Resource />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    path: "/distributors",
    element: (
      <ProtectedRoute permission={[all, distributors]}>
        <Layout>
          <Distributor />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/distributorinfo",
    element: (
      <ProtectedRoute permission={[all, distributors]}>
        <Layout>
          <DistributorInformation />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/update-distributor/:id",
    element: (
      <ProtectedRoute permission={[all, distributors]}>
        <Layout>
          <UpdateDistributor />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/reports",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <Reports />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/reporteditor",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <ReportEditor />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/uploadscreen",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <UploadComponentpic />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/creategroupreport",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <CreateGroupReport />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/edit_report_group/:id",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <UpdateGroupReport/>
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/edit_report_listing/:id",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <UpdateReportEditor/>
        </Layout>
      </ProtectedRoute>
    ),
  },  {
    type: privateType,
    path: "/notifications",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <Notifications />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/user-management",
    element: (
      <ProtectedRoute permission={[all, users]}>
        <Layout>
          <UserManagement />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/create-users",
    element: (
      <ProtectedRoute permission={[all, users]}>
        <Layout>
          <CreateUser />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    path: "/update-user/:id",
    element: (
      <ProtectedRoute permission={[all, users]}>
        <Layout>
          <UpdateUser />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,

    path: "/createlocation",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <CreateLocation />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    path: "/uploadproducts",
    element: (
      <ProtectedRoute permission={[all, products]}>
        <Layout>
          <UploadComponentData />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/duplicaterecords",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <ImportDuplicates />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/summary",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <ImportSummary />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/kitpdf",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <GeneratePdfKit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/kitexcel",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <GenerateExcelKit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  // route for public
  {
    type: publicType,
    path: "/quickreportinfo",
    element: (
      <QuickReportPagesLayout>
        <OnlineQuickPageOne />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/quickreportworkplace",
    element: (
      <QuickReportPagesLayout>
        <OnlineQuickPageTwo />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/quickreportsummary",
    element: (
      <QuickReportPagesLayout>
        <OnlineQuickPageThree />
      </QuickReportPagesLayout>
    ),
  },

  {
    type: publicType,
    path: "/detailedreportinfo",
    element: (
      <QuickReportPagesLayout>
        <DetailedReportPageOne />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/detailedreportsummary",
    element: (
      <QuickReportPagesLayout>
        <DetailedReportSummary />
      </QuickReportPagesLayout>
    ),
  },

  {
    type: publicType,
    path: "/detailedreportaction",
    element: (
      <QuickReportPagesLayout>
        <DetailedReportTakeAction />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/detailedreporforitem",
    element: (
      <QuickReportPagesLayout>
        <DetailedReportForItem />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/detailedreporforfilleditem",
    element: (
      <QuickReportPagesLayout>
        <DetailedReportFilledItem />
      </QuickReportPagesLayout>
    ),
  },

  {
    type: publicType,
    path: "/detailedincidentreportsummary",
    element: (
      <QuickReportPagesLayout>
        <DetailedIncidentReportSummary />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/standardwithquickreport",
    element: (
      <QuickReportPagesLayout>
        <StandardWithQuickReport />
      </QuickReportPagesLayout>
    ),
  },
  {
    type: publicType,
    path: "/success-incident-page",
    element: (
      <QuickReportPagesLayout>
        <SuccessIncidentPage />
      </QuickReportPagesLayout>
    ),
  },

  {
    type: publicType,
    path: "/ID/:id",
    element: <WithOutLoginData />,
  },

  // import and export route

  {
    type: privateType,
    path: "/csvupload",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <ImportCsvFiles />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    path: "/csvexport",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <ExportCsvFiles />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    path: "/multifile",
    element: (
      <ProtectedRoute permission={[all]}>
        <Layout>
          <MultipleFileUpload />
        </Layout>
      </ProtectedRoute>
    ),
  },

  // routes for distributor super admin
  // ];

  // export const distrallibutoRoute = [
  {
    type: privateType,
    path: "/distributor",
    element: (
      <ProtectedRoute permission={[dist_superadmin]}>
        <Layout>
          <DistributorDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/distributor/distributor-QR",
    element: (
      <ProtectedRoute permission={[dist_superadmin]}>
        <Layout>
          <DistQR />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/distributor/usermanagement",
    element: (
      <ProtectedRoute permission={[dist_superadmin, users]}>
        <Layout>
          <DistributorUsermanagement />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    permission: [dist_superadmin, business],

    type: privateType,
    path: "/distributor/businessprofile",
    element: (
      <ProtectedRoute permission={[dist_superadmin, business]}>
        <Layout>
          <DistributorBusinessProfile />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    // permission: [dist_superadmin, business],

    type: privateType,
    path: "/distributor/createlocation",
    element: (
      <ProtectedRoute permission={[dist_superadmin, business]}>
        <Layout>
          <CreateDistributionLocation />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    permission: [dist_superadmin, distributors],

    path: "/distributor/clients",
    element: (
      <ProtectedRoute permission={[dist_superadmin, distributors]}>
        <Layout>
          <DistributorClients />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    type: privateType,
    permission: [dist_superadmin, notifications],

    path: "/distributor/notifilcation",
    element: (
      <ProtectedRoute permission={[dist_superadmin, notifications]}>
        <Layout>
          <DistributorNotification />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/distributor/createuser",
    element: (
      <ProtectedRoute permission={[dist_superadmin]}>
        <Layout>
          <DistributorCreateUser />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,

    path: "/distributor/invite/admin",
    element: (
      <ProtectedRoute permission={[dist_superadmin]}>
        <Layout>
          <DistributorInviteAdmin />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    type: privateType,
    path: "/distributor/update-distibutor-user/:id",
    element: (
      <ProtectedRoute permission={[dist_superadmin]}>
        <Layout>
          <DistributorUpdateUser/>
        </Layout>
      </ProtectedRoute>
    ),
  },
];

export default RouterData;
