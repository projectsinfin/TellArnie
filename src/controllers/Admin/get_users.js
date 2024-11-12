const mongoose = require("mongoose");
const User = require("../../models/User");
const Validation = require("../../utils/Validation");
const config = require("../../../config/config");
const Company = require("../../models/Company");
const Location = require("../../models/Location");
const moment = require("moment");

const get_users = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user.company_id) {
      return res.status(200).json({
        data: {
          Users: [],
        },
        message: "No users found.",
        status: 200,
      });
    }

    const company = await Company.findById(user.company_id);
    const company_name = company ? company.company_name : "";

    let users_list;

    if (user.assigned_role == "rm_superadmin" || user.assigned_role == "rm_admin") {
      users_list = await User.find(
        { _id: { $ne: userId }, created_by: "rm_superadmin", assigned_role: { $ne: "distributor_superadmin" }},
        "first_name last_name id assigned_role job_title location_id profile_pic email"
      ).sort({ account_creation: -1 });

      let rm_users = await User.find(
        { email: { $regex: /@reliancemedical.co.uk$/i } },
        "first_name last_name id assigned_role job_title location_id profile_pic email"
      );

      users_list = users_list.concat(rm_users);

      users_list = await Promise.all(
        users_list.map(async (user) => {
          const location_name = mongoose.Types.ObjectId.isValid(user.location_id)
            ? (await Location.findById(user.location_id))?.location_name || ""
            : "";
          return {
            ...user.toObject(),
            location_name,
          };
        })
      );
    } else if (user.assigned_role == "distributor_superadmin" || user.created_by == "distributor_superadmin") {
      users_list = await User.find(
        { _id: { $ne: userId }, created_by: "distributor_superadmin" },
        "first_name last_name id assigned_role job_title location_id profile_pic email"
      ).sort({ account_creation: -1 });

      users_list = await Promise.all(
        users_list.map(async (user) => {
          const location_name = mongoose.Types.ObjectId.isValid(user.location_id)
            ? (await Location.findById(user.location_id))?.location_name || ""
            : "";
          return {
            ...user.toObject(),
            location_name,
          };
        })
      );
    } else {
      users_list = await User.find(
        { company_id: user.company_id, _id: { $ne: userId } },
        "first_name last_name id assigned_role job_title location_id profile_pic is_firstaid_certified firstaid_certificate_date is_approved email"
      ).sort({ account_creation: -1 });

      users_list = await Promise.all(
        users_list.map(async (user) => {
          let user_status;

          if (user.is_approved == false) {
            user_status = "Pending Approval";
          } else {
            const today = moment();
            const expiryDate = moment(user.firstaid_certificate_date);
            const daysUntilExpiry = expiryDate.diff(today, "days");

            if (user.is_firstaid_certified) {
              if (daysUntilExpiry < 0) {
                user_status = "Training expired";
              } else if (daysUntilExpiry <= 90) {
                user_status = "First Aid Training Expires Soon";
              } else {
                user_status = "First Aid Trained";
              }
            } else {
              user_status = "";
            }
          }

          const location_name = mongoose.Types.ObjectId.isValid(user.location_id)
            ? (await Location.findById(user.location_id))?.location_name || ""
            : "";

          return {
            ...user.toObject(),
            company_name,
            location_name,
            user_status,
          };
        })
      );
    }

    res.status(200).json({
      data: {
        Users: users_list,
      },
      message: "Users found successfully.",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = get_users;
