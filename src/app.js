const express = require("express");
const connectDb = require("../config/mongoose");
const path = require("path");
const multer = require("multer");
const http = require("http");
const config = require("../config/config"); 
const cors = require("cors");
const file_name_generator = require("../middleware/file_name_genrator");
const incident_categories_seeder = require("../src/seeder/incident_categories_seeder");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger-config");
const fs = require("fs");


const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static("/public"));
connectDb();

// incident_categories_seeder();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    if (file.fieldname === "incident_pictures") {
      cb(null, "uploads/incident_pictures");
    } else if (file.fieldname === "profile_pic") {
      cb(null, "uploads/profile_pictures");
    } else if (file.fieldname === "firstaid_certificate") {
      cb(null, "uploads/firstaid_certificates");
    } else if (file.fieldname === "kit_picture") {
      cb(null, "uploads/kit_pictures");
    } else if (file.fieldname === "product_picture") {
      cb(null, "uploads/product_pictures");
    } else if (file.fieldname === "company_logo") {
      cb(null, "uploads/company_logo_pictures");
    } else if (file.fieldname === "company_white_logo") {
      cb(null, "uploads/company_white_logo_pictures");
    } else if (file.fieldname === "kit_location_pic") {
      cb(null, "uploads/kit_location_pictures");
    }  else if (file.fieldname === "product_csv") {
      cb(null, "uploads/product_csv");
    }  else if (file.fieldname === "featured_image") {
      cb(null, "uploads/featured_image");
    }
  },
  filename: function (req, file, cb) {
    const regex = /\/([^/]+)$/;
    const match = file.mimetype.match(regex);
    cb(null, `${file_name_generator()}.${match[1]}`);
  },
});


const incident_pic_dir = path.join(__dirname, "../uploads/incident_pictures");
const profile_pic_dir = path.join(__dirname, "../uploads/profile_pictures");

const firstaid_certificate_dir = path.join(
  __dirname,
  "../uploads/firstaid_certificates"
);
const kit_pic_dir = path.join(__dirname, "../uploads/kit_pictures");
const product_pic_dir = path.join(__dirname, "../uploads/product_pictures");
const kit_location_pic_dir = path.join(
  __dirname,
  "../uploads/kit_location_pictures"
);
const company_logo = path.join(__dirname, "../uploads/company_logo_pictures");
const company_white_logo_dir = path.join(
  __dirname,
  "../uploads/company_white_logo_pictures"
);
const qr_code_picture = path.join(__dirname, "../uploads/qr_code_picture");
const dump_picture = path.join(__dirname,"../uploads/dump_pictures");
const featured_image_picture = path.join(__dirname,"../uploads/featured_image");


app.use("/incident_pictures", express.static(incident_pic_dir));
app.use("/profile_pictures", express.static(profile_pic_dir));
app.use("/qr_code_picture", express.static(qr_code_picture));
app.use("/firstaid_certificates", express.static(firstaid_certificate_dir));
app.use("/kit_location_pictures", express.static(kit_location_pic_dir));
app.use("/kit_pictures", express.static(kit_pic_dir));
app.use("/product_pictures", express.static(product_pic_dir));
app.use("/company_logo_pictures", express.static(company_logo));
app.use("/company_white_logo_pictures", express.static(company_white_logo_dir));
app.use("/dump_pictures", express.static(dump_picture));
app.use("/featured_image", express.static(featured_image_picture));

const upload = multer({ storage: storage });

const signup = require("./controllers/User/signup");
const login = require("./controllers/User/login");
const verify_otp = require("./controllers/User/verify_otp");
const register_company = require("./controllers/Business/register_company");
const register_approver_officer = require("./controllers/Business/register_approver_officer");
const add_product = require("./controllers/Product/add_product");
const update_product = require("./controllers/Product/update_product");
const add_quick_incident = require("./controllers/Incident/add_quick_incident");
const add_detailed_incident = require("./controllers/Incident/add_detailed_incident");
const my_account = require("./controllers/User/my_account");
const authenticateToken = require("../middleware/authenticate_token");
const update_profile = require("./controllers/User/update_profile");
const get_incident_categories = require("./controllers/Incident/get_incident_categories");
const forget_password = require("./controllers/User/forget_password");
const reset_password = require("./controllers/User/reset_password");
const refresh_token = require("./controllers/User/refresh_token");
 const get_incidents_list = require("./controllers/Incident/get_incidents_list");
const add_location = require("./controllers/Location/add_location");
const fetch_location = require("./controllers/Location/fetch_location");
const add_user = require("./controllers/Admin/add_user");
const get_users = require("./controllers/Admin/get_users");
const register_kit = require("./controllers/Product/register_kit");
const is_verified = require("./controllers/User/is_verified");
const fetch_kit_details = require("./controllers/Product/fetch_kit_details");
const distributor_signup = require("./controllers/Distributor/distributor_signup");
const add_kit_location = require("./controllers/Location/add_kit_location");
const get_approver_list = require("./controllers/Admin/get_approver_list");
const get_incident = require("./controllers/Incident/get_incident");
const fetch_products = require("./controllers/Product/fetch_products");
const fetch_kits = require("./controllers/Product/fetch_kits");
const fetch_distributor = require("./controllers/Distributor/fetch_distributor");
const fetch_product = require("./controllers/Product/fetch_product");
const create_article = require("./controllers/Notification/create_article");
const create_notification = require("./controllers/Notification/create_notification");
const get_notifications = require("./controllers/Notification/get_notifications");
const fetch_business_details = require("./controllers/Business/fetch_business_details");
const edit_business_profile = require("./controllers/Business/edit_business_profile");
const create_report_group = require("./controllers/Report/create_report_group");
const fetch_report_group = require("./controllers/Report/fetch_report_group");
const fetch_location_kits = require("./controllers/Location/fetch_location_kits");
const create_report = require("./controllers/Report/create_report");
const fetch_dashboard_details = require("./controllers/Admin/fetch_dashboard_details");
const get_reportData_list = require("./controllers/Report/get_reportData_list");
const get_user_notifcations = require("./controllers/Notification/get_user_notifcations");
const delete_user = require("./controllers/Admin/delete_user");
const edit_business_profile_app = require("./controllers/Business/edit_business_profile_app");
const register_kit_admin = require("./controllers/Admin/register_kit_admin");
const get_notifcation_by_id = require("./controllers/Notification/get_notifcation_by_id");
const fetch_qr_image = require("./controllers/Product/fetch_qr_image");
const delete_profile_pic = require("./controllers/User/delete_profile_pic");
const get_user_by_id = require("./controllers/Admin/get_user_by_id");
const update_user_profile = require("./controllers/Admin/update_user_profile");
const web_login = require("./controllers/Admin/web_login");
const web_dashboard_details = require("./controllers/Admin/web_dashboard_details");
const web_incident_categories = require("./controllers/Incident/web_incident_categories");
const import_products = require("./controllers/Product/import_product");
const fetch_reports = require("./controllers/Report/fetch_reports");
const update_risk_assessment = require("./controllers/Product/update_risk_assessment");
const generate_quote = require("./controllers/Admin/generate_quote");
const web_quick_incident = require("./controllers/Incident/web_quick_incident");
const web_detailed_incident = require("./controllers/Incident/web_detailed_incident");
const update_location = require("./controllers/Location/update_location");
const disable_users = require("./controllers/Admin/disable_users");
const fetch_kit_products = require("./controllers/Product/fetch_kit_products");
const approve_user = require("./controllers/Admin/approve_user");
const get_kit_pictures = require("./controllers/Admin/get_kit_pictures");
const distributor_dashboard_details = require("./controllers/Admin/distributor_dashboard_details");
const delete_location = require("./controllers/Admin/delete_location");
const delete_product = require("./controllers/Product/delete_product");
const delete_user_by_id = require("./controllers/Admin/delete_user_by_id");
const delete_location_by_id = require("./controllers/Admin/delete_location_by_id");
const delete_kit_by_id = require("./controllers/Admin/delete_kit_by_id");
const update_user_by_id = require("./controllers/Admin/update_user_by_id");
const get_article_by_id = require("./controllers/Notification/get_article_by_id");
const update_article_by_id = require("./controllers/Notification/update_article_by_id");
const update_notification_by_id = require("./controllers/Notification/update_notification_by_id");
const get_newsupdate = require("./controllers/Notification/get_newsupdate");
const delete_kits_web = require("./controllers/Admin/delete_kits_web");
const get_distributor_by_id = require("./controllers/Distributor/get_distributor_by_id");
const update_distributor_by_id = require("./controllers/Distributor/update_distributor_by_id");
const delete_distributor = require("./controllers/Distributor/delete_distributor");
const delete_messages = require("./controllers/Notification/delete_messages");
const delete_reports = require("./controllers/Report/delete_reports");
const export_products = require("./controllers/Product/export_product");
const export_users = require("./controllers/Product/export_users");
const export_registered_kits = require("./controllers/Product/export_registered_kits");	
const import_users = require("./controllers/Product/import_user");
const delete_report_group_by_id = require("./controllers/Report/delete_report_group_by_id");
const get_report_by_id = require("./controllers/Report/get_report_by_id");
const get_report_group_by_id = require("./controllers/Report/get_report_group_by_id");
const update_report = require("./controllers/Report/update_report");
const update_report_group = require("./controllers/Report/update_report_group");
const get_location_by_id = require("./controllers/Admin/get_location_by_id");
const send_invitation_mail = require("./controllers/Admin/send_invitation_mail");
const get_clients = require("./controllers/Admin/get_clients");
const register_empty_kit = require("./controllers/Admin/register_empty_kit");
const get_distributor_qr = require("./controllers/Distributor/get_distributor_qr");
const fetch_location_kit_details = require("./controllers/Product/fetch_location_kit_details");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/user/signup", signup);
app.post("/user/login", login);
app.post("/admin/login", web_login);
app.post("/user/verify_otp", verify_otp);
app.get("/user/my_account", authenticateToken, my_account);
app.put(
  "/user/update_profile",
  authenticateToken,
  upload.any("profile_pic", "firstaid_certificate"),
  update_profile
);
app.get("/user/is_verified", authenticateToken, is_verified);

app.get("/incident_categories", authenticateToken, get_incident_categories);
app.get("/admin/incident_categories", web_incident_categories);
app.get("/admin/incidents",authenticateToken, get_incidents_list);

app.get("/admin/fetch_qr_image/:id", fetch_qr_image);
app.post("/admin/import_products",authenticateToken,upload.any("product_picture"),import_products);

app.get("/admin/get_user_by_id/:id",authenticateToken, get_user_by_id);

app.post("/admin/fetch_location_kit_details", authenticateToken, fetch_location_kit_details);

app.post("/company/register", register_company);
app.post("/company/register_approver_officer", register_approver_officer);
app.put("/admin/edit_business_profile_app",authenticateToken, edit_business_profile_app);

app.delete("/admin/delete_profile_pic",authenticateToken, delete_profile_pic);
app.delete("/admin/delete_user_by_id",authenticateToken, delete_user_by_id);

app.get("/admin/get_report_by_id",authenticateToken, get_report_by_id);
app.get("/admin/get_report_group_by_id",authenticateToken, get_report_group_by_id);

app.delete("/admin/delete_location_by_id",authenticateToken, delete_location_by_id);
app.delete("/admin/delete_kit_by_id",authenticateToken, delete_kit_by_id);
app.delete("/admin/delete_kits",authenticateToken, delete_kits_web);
app.get("/admin/get_distributor_by_id",authenticateToken, get_distributor_by_id);

app.post("/admin/disable_users", authenticateToken,disable_users)

app.get("/admin/get_message_by_id", authenticateToken, get_article_by_id);
app.get("/admin/get_newsupdate",authenticateToken ,get_newsupdate);
app.delete("/admin/delete_report_group_by_id",authenticateToken, delete_report_group_by_id);
app.post("/admin/send_invitation_mail",authenticateToken,send_invitation_mail);

app.post(
  "/admin/add_product",
  authenticateToken,
  upload.any("product_picture"),
  add_product
);
app.post("/admin/update_product", authenticateToken, update_product);
app.post(
  "/admin/register_kit",
  authenticateToken,
  upload.any("kit_picture"),
  register_kit
);

app.post("/admin/import_users",authenticateToken,upload.any("product_picture"),import_users);
app.post(
  "/admin/register_batch_kit",
  authenticateToken,
  register_kit_admin
);
app.get("/admin/fetch_products", authenticateToken, fetch_products);
app.get("/admin/fetch_kits", authenticateToken, fetch_kits);
app.get("/admin/product/" ,fetch_product);
app.get("/admin/fetch_reports",authenticateToken ,fetch_reports);
app.post("/admin/export_registered_kits", authenticateToken, export_registered_kits);

app.get("/admin/fetch_kit_products", authenticateToken, fetch_kit_products);
app.put("/admin/update_report_by_id", authenticateToken, update_report);
app.put("/admin/update_report_group_by_id", authenticateToken, update_report_group);

app.get("/admin/fetch_dashboard_details", authenticateToken,fetch_dashboard_details)
app.get("/admin/web_dashboard_details", authenticateToken,web_dashboard_details)
app.get("/admin/distributor_dashboard_details", authenticateToken,distributor_dashboard_details)
app.get("/admin/get_clients", authenticateToken, get_clients);

app.post("/admin/get_kit_pictures", authenticateToken, get_kit_pictures);

app.get("/admin/get_user_notifcations", authenticateToken,get_user_notifcations)
app.get("/admin/get_user_notifcation/:id",authenticateToken ,get_notifcation_by_id);
app.post("/admin/approve_user", authenticateToken, approve_user);
app.put("/admin/update_article_by_id", authenticateToken,upload.any("featured_image"), update_article_by_id);
app.put("/admin/update_notification_by_id", authenticateToken, update_notification_by_id);
app.delete("/admin/delete_distributor", authenticateToken, delete_distributor);
app.delete("/admin/delete_messages", authenticateToken, delete_messages);
app.delete("/admin/delete_reports", authenticateToken, delete_reports);
app.post("/admin/export_products", authenticateToken, export_products);
app.post("/admin/export_users", authenticateToken, export_users);
const export_distributors = require("./controllers/Product/export_distributors");


app.get("/admin/fetch_kit_details", authenticateToken, fetch_kit_details);
app.post(
  "/admin/add_kit_location",
  authenticateToken,
  upload.any("kit_location_pic"),
  add_kit_location
);

app.delete("/admin/delete_location", authenticateToken, delete_location);
app.post("/admin/add_quick_incident", authenticateToken, add_quick_incident);
app.post(
  "/admin/add_detailed_incident",
  authenticateToken,
  upload.any("incident_pictures"),
  add_detailed_incident
);
app.get("/admin/incident/:id", authenticateToken, get_incident);

app.get("/admin/fetch_location", authenticateToken, fetch_location);

app.post("/admin/add_location", authenticateToken, add_location);
app.post(
  "/admin/register_user",
  authenticateToken,
  upload.any("profile_pic", "firstaid_certificate"),
  add_user
);

app.put(
  "/admin/update_user_profile/:id",
  authenticateToken,
  upload.any("profile_pic"),
  update_user_profile	
);

app.put(
  "/admin/edit_user_details",
  authenticateToken,
  upload.any("firstaid_certificate"),
  update_user_by_id
);

app.post(
  "/admin/register_empty_kit",
  authenticateToken,
  register_empty_kit
);

app.delete("/admin/delete_user", authenticateToken, delete_user);
app.delete("/admin/delete_product", authenticateToken, delete_product);


app.get("/admin/get_approver", authenticateToken, get_approver_list);

app.get("/admin/get_users", authenticateToken, get_users);

app.get("/admin/get_reportData_list", authenticateToken, get_reportData_list);

app.post("/user/refresh_token", refresh_token);

app.post("/forget_password", forget_password);
app.post("/reset_password", reset_password);
app.put("/admin/update_location", authenticateToken, update_location);

// Distributor api

app.post(
  "/admin/create_distributor",
  upload.any("company_logo", "company_white_logo"),
  distributor_signup
);

app.put(
  "/admin/update_distributor",
  upload.any("company_logo", "company_white_logo"),
  update_distributor_by_id
);

app.put(
  "/admin/edit_user_details",
  authenticateToken,
  upload.any("firstaid_certificate"),
  update_user_by_id
);

app.post(
  "/admin/create_article",
  authenticateToken,
  upload.any("featured_image"),
  create_article
);

app.post(
  "/admin/create_notification",
  authenticateToken,
  create_notification
);

app.get("/admin/get_messages",authenticateToken,get_notifications);

app.get("/admin/fetch_distributor", authenticateToken, fetch_distributor);
app.get("/admin/fetch_business_details", authenticateToken, fetch_business_details);
app.put("/admin/edit_business_details",upload.any('company_logo'), authenticateToken, edit_business_profile);
app.post("/admin/export_distributors", authenticateToken, export_distributors);
app.post("/admin/create_report_group", authenticateToken, create_report_group);
app.get("/admin/fetch_report_group", authenticateToken, fetch_report_group);
app.get("/admin/get_location_by_id",authenticateToken, get_location_by_id);

app.post("/admin/update_risk_assessment", authenticateToken, update_risk_assessment);

app.post("/admin/web_detailed_incident", web_detailed_incident);
app.post("/admin/web_quick_incident", web_quick_incident);

app.post("/admin/create_report", authenticateToken, create_report);
app.post("/admin/generate_quote", authenticateToken,generate_quote);

app.get("/admin/fetch_location_kits", authenticateToken,fetch_location_kits)
app.get("/admin/download_qr_code", authenticateToken,get_distributor_qr );

server.listen(config.PORT, () => {
  console.log("server is running on", config.PORT);
});
