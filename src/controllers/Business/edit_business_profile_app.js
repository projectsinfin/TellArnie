const User = require("../../models/User");
const config = require("../../../config/config");
const fs = require("fs");
const Validation = require("../../utils/Validation");
const Company = require("../../models/Company");
const Distributor = require("../../models/Distributor");

const edit_business_profile_app = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    const companyData = {};
    const userData = {};

    if (req.body.company_name) {
      companyData.company_name = req.body.company_name;
    }


    if (req.body.salesRepresentatives && req.body.salesRepresentatives.length > 0) {

      const salesRepresentatives = req.body.salesRepresentatives;

      // Loop through each sales representative
      for (const representative of salesRepresentatives) {
        const { email, distributor_name, phone, user_id } = representative;

        userData.distributor_name = distributor_name;

        companyData.distributor_email = email;


        const phoneNumberParts = phone.split(' ');
        const country_code = phoneNumberParts[0];
        const contact_number = phoneNumberParts.slice(1).join(' ');

        const existingUser = await Distributor.findOne({ email });

        console.log(existingUser);

        if (!existingUser) {
          // if(existingUser)
          userData.email = email;

          const existingNumber = await User.findOne({
            contact_number: contact_number,
          });
    
          if (!existingNumber) {
             userData.contact_number = contact_number;
             userData.country_code = country_code;
          } else if(existingNumber && existingNumber.contact_number == contact_number){
             userData.country_code = country_code;
          } else {
            return res.status(200).json({
              message: "Phone number already used by other user.",
              status: 200,
            });
          }
        

          // Create or update user information for the sales representative
          await Distributor.findByIdAndUpdate(user_id,userData );
        }else if(existingUser && existingUser._id == user_id){

          if (!existingNumber) {
            userData.contact_number = contact_number;
            userData.country_code = country_code;
         } else if(existingNumber && existingNumber.contact_number == contact_number){
            userData.country_code = country_code;
         } else {
           return res.status(200).json({
             message: "Phone number already used by other user.",
             status: 200,
           });
         }
          const existingNumber = await Distributor.findOne({
            contact_number: contact_number,
          });
    
          // Create or update user information for the sales representative
          await Distributor.findByIdAndUpdate(user_id,userData );
        } else {
          return res.status(200).json({
            message: `The email ${email} has already been used by other user.`,
            status: 200,
          });
        }
      }
    }

    // Update company information
    await Company.findByIdAndUpdate(user.company_id, companyData);

    return res.status(200).json({
      message: `Successfully updated the business profile.`,
      status: 200,
    });
  } catch (error) {
    if (Validation().validateDuplicacy(error) === true) {
      res.status(500).json({
        data: null,
        status: 500,
        message: error,
      });
    } else {
      res.status(401).json({
        data: null,
        status: 401,
        message: Validation().validateDuplicacy(error),
      });
    }
  }
};

module.exports = edit_business_profile_app;
