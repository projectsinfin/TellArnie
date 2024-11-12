const users = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../../config/config");
const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");
const Token = require("../../models/Token");
const Distributor = require("../../models/Distributor");

const web_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let User = await users.findOne({ email: email });

    // Check for distributor if user is not found
    if (!User) {
      let distributor = await Distributor.findOne({ email: email });

      if (distributor && bcrypt.compareSync(password, distributor.password)) {
        const access_token = accesstoken_generator(distributor);
        const refresh_token = refreshtoken_generator(distributor);

        const dbToken = new Token({ token: access_token });
        await dbToken.save();

        return res.status(200).json({
          data: {
            message: `Welcome ${distributor.distributor_name}`,
            access_token: access_token,
            refresh_token: refresh_token,
            user_id: distributor._id,
            role: distributor.role,
            verified: true,
            permissions: distributor.permissions,
            status: true,
          },
          status: 200,
          message: "User login successfully.",
        });
      } else {
        return res.status(401).json({
          data: null,
          status: 401,
          message: "No account found",
        });
      }
    }

   // if (!User.verified) {
   //   return res.status(401).json({
  //      data: null,
  //      status: 401,
  //      message: "Verify your account first",
 //     });
  //  }

    const isRelianceMedicalEmail = /@reliancemedical.co.uk$/i.test(User.email);

    if (
      isRelianceMedicalEmail ||
      User.email == "megan.foreman@reliancemedical.co.uk" ||
      User.email == "thomas.pear@reliancemedical.co.uk" ||
      User.assigned_role == "rm_superadmin" ||
      User.assigned_role == "rm_admin" ||
      User.assigned_role == "distributor_superadmin" ||
      User.assigned_role == "distributor_user" ||
      User.created_by == "rm_superadmin"
    ) {
      if (bcrypt.compareSync(password, User.password)) {
        const access_token = accesstoken_generator(User);
        const refresh_token = refreshtoken_generator(User);

        const dbToken = new Token({ token: access_token });
        await dbToken.save();

        return res.status(200).json({
          data: {
            message: `Welcome ${User.first_name} ${User.last_name}`,
            access_token: access_token,
            refresh_token: refresh_token,
            user_id: User._id,
            role: isRelianceMedicalEmail ? "rm_admin" : User.assigned_role,
            verified: User.verified,
            permissions: isRelianceMedicalEmail ? ["All"] : User.permissions,
            status: true,
          },
          status: 200,
          message: "User login successfully.",
        });
      } else {
        return res.status(401).json({
          data: null,
          status: 401,
          message: "Password does not match.",
        });
      }
    } else {
      return res.status(400).json({
        data: null,
        status: 400,
        message: "You are not authorised.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = web_login;
