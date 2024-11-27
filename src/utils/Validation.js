import * as Yup from "yup";
// import parsePhoneNumber from "libphonenumber-js";
import {
  parsePhoneNumberFromString,
  parsePhoneNumber,
} from "libphonenumber-js"; // Import parsePhoneNumberFromString from libphonenumber-js

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const namePattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
export const phoneNumberPattern =
  /^[+]?[0-9]{1,3}?[-.\\s]?[(]?[0-9]{1,4}[)]?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}$/;

export const LoginSchema = Yup.object().shape({
  businessEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const validatePhoneNumber = (phoneNumber, country_Code) => {
  try {
    // Check if the phone number starts with '7' or '8'
    if (phoneNumber.length === 14) {
      // console.log("phoneNumber---****", phoneNumber);
      const abc = phoneNumber.slice(0, -1);
      // console.log("phoneNumber---**** abc", abc);
      const parsedPhoneNumber = parsePhoneNumber(abc, country_Code);
      // console.log("parsedPhoneNumber 111", parsedPhoneNumber.nationalNumber);
      return parsedPhoneNumber && parsedPhoneNumber.isValid();
    } else {
      // console.log("err-----");
      // If the phone number doesn't start with '7' or '8', assume it already includes the country code
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber, country_Code);
      console.log("parsedPhoneNumber", parsedPhoneNumber);
      return parsedPhoneNumber && parsedPhoneNumber.isValid(); // Check if the parsed phone number is valid
    }
  } catch (error) {
    console.error("Error validating phone number:", error);
    return false; // Return false if there's an error
  }
};

export const SignUpSchema = (country_Code, val) =>
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    // lastName: Yup.string().required("Last Name is required"),
    businessEmail: Yup.string()
      .required("Business email is required")
      .email("Invalid business email"),
    officeLocation: Yup.string().required("Office location is required"),
    // phoneNumber: Yup.string()
    //   .test(
    //     "phone-format",
    //     "Invalid phone number format for the specified country",
    //     function (value) {
    //       console.log(
    //         "country_Code---",
    //         country_Code,
    //         "---",
    //         value,
    //         "ivalid phone number "
    //       );
    //       var phone = val + value;
    //       if (!validatePhoneNumber(phone, country_Code)) {
    //         console.log("Phone number validation failed!");
    //         return false;
    //       }
    //       return true;
    //     }
    //   )
    //   .required("Phone number is required"),
    jobTitle: Yup.string().required("Job title is required"),
  });

export const OtpSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const EnterAddProductSchema = Yup.object().shape({
  brand: Yup.string().required("Brand is required"),
  product_code: Yup.string().required("Product code is required"),
  description: Yup.string().required("Item description is required"),
  quantity: Yup.string().required("Quantity is required"),
  lotNumber: Yup.string().required("Lot number is required"),
});

export const EnterKitNotFoundSchema = Yup.object().shape({
  brand: Yup.string().required("Brand is required"),
  // modelNumber: Yup.string().required("Module number is required"),
  productName: Yup.string().required("Product name is required"),
  lotNumber: Yup.string().required("Lot number is required"),
  batchNumber: Yup.string().required("Product code is required"),
});

export const EnterLocationSchema = Yup.object().shape({
  // area: Yup.string().required("Area is required"),
});

export const itemQuantitySchema = Yup.object().shape({
  quantity: Yup.string().required("Quantity is required"),
});

export const AdminRegisterUser = (country_Code, val) =>
  Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    // lastName: Yup.string().required("Last name is required"),
    businessEmail: Yup.string()
      .required("Business email is required")
      .email("Invalid business email"),
    // phoneNumber: Yup.string()
    //   // .matches(/^[0-9]+$/, "Must be only digits")
    //   // .min(7, "Must be at least 7 digits")
    //   // .max(10, "Must be at most 10 digits")
    //   .test(
    //     "phone-format",
    //     "Invalid phone number format for the specified country",
    //     function (value) {
    //       console.log(country_Code, "---", value, "ivalid phone number ");
    //       var phone = val + value;
    //       if (!validatePhoneNumber(phone, country_Code)) {
    //         console.log("Phone number validation failed!");
    //         return false;
    //       }
    //       return true;
    //     }
    //   )
    //   .required("Phone number is required"),
    jobTitle: Yup.string().required("Job title is required"),
  });

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const ApprovalsContactValidation = (country_Code, val) =>
  Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    // last_name: Yup.string().required("Last name is required"),
    BusinessName: Yup.string()
      .required("Business email is required")
      .email("Invalid business email"),
    // contact_number: Yup.string()
    //   // .matches(/^[0-9]+$/, "Must be only digits")
    //   // .min(7, "Must be at least 7 digits")
    //   // .max(10, "Must be at most 10 digits")
    //   .test(
    //     "phone-format",
    //     "Invalid phone number format for the specified country",
    //     function (value) {
    //       console.log(country_Code, "---", value, "ivalid phone number ");
    //       var phone = val + value;
    //       if (!validatePhoneNumber(phone, country_Code)) {
    //         console.log("Phone number validation failed!");
    //         return false;
    //       }
    //       return true;
    //     }
    //   )
    //   .required("Phone number is required"),
    job_title: Yup.string().required("Job title is required"),
  });

export const CompanyInfoSchema = (country_Code, val) =>
  Yup.object().shape({
    address: Yup.string().required("Address is required"),
    street: Yup.string().required("Street is required"),
    // city: Yup.string().required("City is required"),
    // County: Yup.string().required("County is required"),
    zipCode: Yup.string().required("Post Code is required"),
    // Number: Yup.string()
    //   // .matches(/^[0-9]+$/, "Must be only digits")
    //   // .min(7, "Must be at least 7 digits")
    //   // .max(10, "Must be at most 10 digits")
    //   .test(
    //     "phone-format",
    //     "Invalid phone number format for the specified country",
    //     function (value) {
    //       console.log(country_Code, "---", value, "ivalid phone number ");
    //       var phone = val + value;
    //       if (!validatePhoneNumber(phone, country_Code)) {
    //         console.log("Phone number validation failed!");
    //         return false;
    //       }
    //       return true;
    //     }
    //   )
    //   .required("Phone number is required"),
    business_email: Yup.string()
      .email("Invalid business email")
      .required("Business email is required"),
  });

export const RegisterCompanyValidation = (country_Code, val) =>
  Yup.object().shape({
    company_name: Yup.string().required("Business name is required"),
    streetAddress: Yup.string().required("Street Address is required"),
    address: Yup.string().required("Address is required"),
    // city: Yup.string().required("City is required"),
    // county: Yup.string().required("County is required"),
    zip_code: Yup.string().required("Post code is required"),
    // .matches(/^[0-9]+$/, "Must be only digits"),
    distributor_name: Yup.string().required(
      "First Aid Supplier’s name is required"
    ),
    distributor_email: Yup.string()
      .required("First Aid Supplier’s email is required")
      .email("Invalid business email"),
  });

export const EditProfileValidation = (country_Code, val) =>
  Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    // last_name: Yup.string().required("Last name is required"),
    email: Yup.string().required("Email is required"),
    company_name: Yup.string().required("company name is required"),
    // contact_number: Yup.string()
    //   .test(
    //     "phone-format",
    //     "Invalid phone number format for the specified country",
    //     function (value) {
    //       console.log(
    //         "country_Code---",
    //         country_Code,
    //         "---",
    //         value,
    //         "ivalid phone number "
    //       );
    //       var phone = val + value;
    //       if (!validatePhoneNumber(phone, country_Code)) {
    //         console.log("Phone number validation failed!");
    //         return false;
    //       }
    //       return true;
    //     }
    //   )
    //   .required("Phone number is required"),
    job_title: Yup.string().required("Job title is required"),
  });

// first_name: profileDetails?.data.user_details.first_name,
// last_name: profileDetails?.data.user_details.last_name,
// email: profileDetails?.data.user_details.email || "",
// contact_number: profileDetails?.data.user_details.contact_number,
// country_code: profileDetails?.data.user_details.country_Code,
// profile_pic: "",
// verified: true,
// job_title: profileDetails?.data.user_details.job_title,
// employee_id: profileDetails?.data.user_details.employee_id,
// assigned_role: "",
// company_name: profileDetails?.data.user_details.company_name,
