const Company = require("../../models/Company");
const Location = require("../../models/Location");
const User = require("../../models/User");
const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");
const Token = require("../../models/Token");
const Validation = require("../../utils/Validation");

const register_company = async (req, res) => {
  let access_token, refresh_token; // Declare variables here

  try {
    const {
      company_name,
      location_name,
      longitude,
      latitude,
      industry,
      street,
      city,
      county,
      country,
      distributor_email,
      distributor_name,
      zip_code,
      user_id,
    } = req.body;


    if (!Validation().email(distributor_email)) {
      return res.status(400).json({
        status: 400,
        message: "Email is not valid",
      });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "User does not found.",
      });
    }

    const company_data = {};
    const location_data = {};

    const domain = user.email.split('@')[1];

    // Use domain as distributor domain
    company_data.domain = domain;

    // Update company fields if provided in request body
    if (distributor_name) {
      company_data.distributor_name = distributor_name;
    }

    if (company_name) {
      company_data.company_name = company_name;
    }

    if (industry) {
      company_data.industry = industry;
    }

    if (street) {
      company_data.street = street;
      location_data.street = street;
    }

    if (city) {
      company_data.city = city;
      location_data.city = city;
    }else{
      return res.status(400).json({
        status: 400,
        message: "City is required.",
      });
    }

    if (county) {
      company_data.county = county;
      location_data.county = county;
    }else{
      return res.status(400).json({
        status: 400,
        message: "County is required.",
      });
    }

    if (country) {
      company_data.country = country;
      location_data.country = country;
    }else{
      return res.status(400).json({
        status: 400,
        message: "Country is required.",
      });
    }

    if (zip_code) {
      company_data.zip_code = zip_code;
    }

    if (location_name) {
      location_data.location_name = location_name;
      location_data.business_email = user.email;
      location_data.telephone = `${user.country_code} ${user.contact_number}`;
      location_data.assigned_admin_id = user_id;
    }

    if (longitude) {
      location_data.longitude = longitude;
    }

    if (latitude) {
      location_data.latitude = latitude;
    }

    if (distributor_email) {
      company_data.distributor_email = distributor_email;
    }

    let new_company = await Company.create(company_data);

    if (new_company) {

      location_data.company_id = new_company._id;

      console.log(location_data)
      const new_location = await Location.create(location_data);

      user.company_id = new_company._id;
      user.location_id = new_location._id;

      await user.save();
      // Generate tokens
      access_token = accesstoken_generator(user);
      refresh_token = refreshtoken_generator(user);

      const dbToken = new Token({ token: access_token });
      dbToken.save();
    }

    return res.status(200).json({
      data: {
        company_id: new_company._id,
        user_id: user_id,
        access_token: access_token,
        refresh_token: refresh_token,
        role: user.assigned_role,
      },
      message: "Company register successfully.",
      status: 200,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = register_company;
