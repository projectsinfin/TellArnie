import * as Yup from "yup";

// phone number regex
const phonenumberRegex =
  /^[+]?[0-9]{1,3}?[-.\\s]?[(]?[0-9]{1,4}[)]?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}$/;

// Define validation schema for login using Yup
// const loginSchema = Yup.object().shape({
//   email: Yup.string().email().required("*Email is required"),
//   password: Yup.string().required("*Password is required"),
// });
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("*Email is required"),
  password: Yup.string().required("*Password is required"),
});

// Define validation schema for distributorinformation using Yup
const distributorInfoSchema = Yup.object().shape({
  distributor_name: Yup.string().required("*Distribution name is required"),
  street: Yup.string().required("*Street is required"),
  county: Yup.string().required("*County is required"),
  country: Yup.string().required("*Country is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("*Email is required"),
  postal_code: Yup.string().required("*Postal code is required"),
  country_code: Yup.string().required("*Country code is required"),
  contact_number: Yup.string()
    .matches(phonenumberRegex, "*Enter a valid phone number")
    .required("*Phone number is required"),
  company_logo: Yup.string().required("*Company logo is required"),
  company_white_logo: Yup.string().required("*Company white logo is required"),
  // alternate_distributor_name: Yup.string().required(
  //   "*Alternate distributor is required"
  // ),
  // role: Yup.string().required("*Role is required"),
});

// Define validation schema for create new user using Yup
const createNewUserSchema = Yup.object().shape({
  first_name: Yup.string().required("*First name is required"),
  last_name: Yup.string().required("*Last name is required"),
  location_id: Yup.string().required("*Office location is required"),
  contact_number: Yup.string()
    .matches(phonenumberRegex, "*Enter a valid phone number")
    .required("*Phone number is required"),
  // country_code: Yup.string().required("*Country code is required"),
  // employee_id: Yup.string().required("*Employee id is required"),
  job_title: Yup.string().required("*Job title is required"),
  assigned_role: Yup.string().required("*Role is required"),
  permissions: Yup.array()
    .required("*Permissions is required")
    .min(1, "At least 1 permision is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("*Email is required"),
});
// Define validation schema for create location using Yup
const createLocationSchema = Yup.object().shape({
  location_name: Yup.string().required("*Location name is required"),
  street: Yup.string().required("*Street is required"),
  city: Yup.string().required("*City is required"),
  county: Yup.string().required("*County is required"),
  country: Yup.string().required("*Country is required"),
  zip_code: Yup.string().required("*Post code is required(Only UK)"),
  business_email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("* Business Email is required"),
  country_code: Yup.string().required("*Country code is required"),
  contact_number: Yup.string()
    .matches(phonenumberRegex, "*Enter a valid phone pumber")
    .required("*Phone number is required"),
  // assigned_admin_id: Yup.string().required("*Asign admin is required"),
  // assigned_approver_id: Yup.string().required("*Asign approver is required"),
});
// Define validation schema for update business profile user
const updateBusinessProfileUserSchema = Yup.object().shape({
  company_name: Yup.string().required("*Company name is required"),
  country_code: Yup.string().required("*Country code is required"),
  contact_number: Yup.string()
    .matches(phonenumberRegex, "*Enter a valid phone pumber")
    .required("*Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("*Email is required"),
  assigned_role: Yup.string().required("*Assigned_role is required"),
});

// Define validation schema for create report
const createReportSchema = Yup.object().shape({
  group_name: Yup.string().required("*Group name is required"),
  group_member: Yup.array()
    .required("*Group member is required")
    .min(1, "*At least 1 group member is required"),
});
const createnewreportSchema = Yup.object().shape({
  report_name: Yup.string().required("*Report name is required"),
  start_on: Yup.date().required("*Start date is required"),
  frequency_units: Yup.string().required("*Frequency units are required"),
  how_often: Yup.string().required("*How often is required"),
  // send_to_group: Yup.array().min(1, "*At least one group must be selected"),
  send_to_user: Yup.array().min(1, "*At least one user must be selected"),
});

// Define validation schema for create kit
const createKitSchema = Yup.object().shape({
  product_code: Yup.string().required("*product code  is required"),
  // product_name: Yup.string().required("*Product name is required"),
  lot_number: Yup.string().required("*Lot number is required"),
  expiry_date: Yup.string().required("*Expiry date is required"),
  // distributor_id: Yup.string().required("Distributor name is required"),
  // sales_rep: Yup.string().required("Sales representative is required"),
  // quantity: Yup.string().required("*Quantity is required"),
  quantity: Yup.number()
  .min(1, 'Quantity must be greater than zero')
  .required('Quantity is required'),
  // product_quantity:Yup.number()
  // .min(1, 'Quantity must be greater than zero')
  // .required('Quantity is required'),
// Add any other validation rules for other fields
});

// validation schema for distributor roles
const createSchemaForDistributorUser = Yup.object().shape({
  first_name: Yup.string().required("*First name is required"),
  last_name: Yup.string().required("*Last name is required"),
  location_id: Yup.string().required("*Office location is required"),
  job_title: Yup.string().required("*Job title is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("*Email is required"),
});
// schema for distributor business profile

const createSchemaForDistributorBusinessProfile = Yup.object().shape({
  company_name: Yup.string().required("*Company name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address format")
    .required("*Email is required"),
});

const ValidationSchema = {
  login: loginSchema,
  distributorinformation: distributorInfoSchema,
  createnewuser: createNewUserSchema,
  createlocation: createLocationSchema,
  updatebusinessprofileuser: updateBusinessProfileUserSchema,
  createreport: createReportSchema,
  createnewreport: createnewreportSchema,
  createkit: createKitSchema,
  createUserForDistributor: createSchemaForDistributorUser,
  createBusinessProfileForDistributor:
    createSchemaForDistributorBusinessProfile,
};

export default ValidationSchema;
