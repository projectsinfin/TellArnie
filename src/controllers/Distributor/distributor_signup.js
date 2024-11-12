const Distributor = require("../../models/Distributor");
const Company = require("../../models/Company");
const Validation = require("../../utils/Validation");
const config = require("../../../config/config");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const password_generator = require("../../../middleware/user/password_generator");

const distributor_signup = async (req, res) => {
  try {
    const { SERVER_BASE_URL } = config;

    const {
      distributor_name,
      street,
      county,
      country,
      email,
      postal_code,
      country_code,
      contact_number,
      alternate_distributor_name,
      role,
    } = req.body;

    const distributorData = {};

    const company_data = {};

    // Update company fields if provided in request body
    if (distributor_name) {
      company_data.distributor_name = distributor_name;
    }

    if (distributor_name) {
      company_data.company_name = distributor_name;
    }

    if (distributor_name) {
      company_data.industry = "Distributor";
    }

    if (street) {
      company_data.street = street;
    }

    if (county) {
      company_data.city = county;
    }

    if (county) {
      company_data.county = county;
    }

    if (country) {
      company_data.country = country;
    }

    if (postal_code) {
      company_data.zip_code = postal_code;
    }

    if (email) {
      company_data.distributor_email = email;
    }

    let new_company = await Company.create(company_data);

    if (distributor_name) {
      distributorData.distributor_name = distributor_name;
      distributorData.company_id = new_company._id;
      distributorData.created_by = "rm_superadmin";
      distributorData.permissions = "All Distributor";
    }

    if (street) {
      distributorData.street = street;
    }

    if (county) {
      distributorData.county = county;
    }

    if (country) {
      distributorData.country = country;
    }

    if (email) {
      distributorData.email = email;
    }

    if (postal_code) {
      distributorData.postal_code = postal_code;
    }

    if (country_code) {
      distributorData.country_code = country_code;
    }

    if (contact_number) {
      distributorData.contact_number = contact_number;
    }

    if (alternate_distributor_name) {
      distributorData.alternate_distributor_name = alternate_distributor_name;
    }

    if (role) {
      distributorData.role = role;
    }

    const password = password_generator(10);

    const hashPassword = await bcrypt.hash(password, 10);

    distributorData.password = hashPassword;

    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "noreply@tellarnie.com",
        pass: "Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz",
      },
    });

   let email_html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Hi, ${distributor_name}</h2>
        <p>You are receiving this email for registration of your account with Tellarnie.</p>
        
        <p>Your email is: ${email}</p>
        <p>Your password is: ${password}</p>
        
        <p>You can log in to your account by clicking the link below:</p>
        <p><a href="https://beta.tellarnie.com/login" style="color: #1a73e8; text-decoration: none;">Log in to Tellarnie</a></p>
        
        <p>If you did not request this account creation, please ignore this email.</p>
    </div>
`;


    if (hashPassword) {
      distributorData.password = hashPassword;
    }

    if (req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "company_logo") {
          const company_logo_name = file.filename;
          distributorData.company_logo = `${SERVER_BASE_URL}company_logo_pictures/${company_logo_name}`;
        }
        if (file.fieldname === "company_white_logo") {
          const company_white_logo_name = file.filename;
          distributorData.company_white_logo = `${SERVER_BASE_URL}company_white_logo_pictures/${company_white_logo_name}`;
        }
      });
    }

    const newDistributor = await Distributor.create(distributorData);

    if (newDistributor) {
      // Send mail with defined transport object
      let info = await transporter.sendMail({
        from: "noreply@tellarnie.com",
        to: email,
        subject: "Register successfully with Tellarnie ",
        text: `Your registered password is ${password}`,
        html: email_html,
      });
    }

    return res.status(200).json({
      data: {
        distributor: newDistributor,
        message: "Distributor signed up successfully",
      },
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = distributor_signup;
