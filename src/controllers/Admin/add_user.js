const User = require("../../models/User");
const Validation = require("../../utils/Validation");
const config = require("../../../config/config");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const password_generator = require("../../../middleware/user/password_generator");
const Distributor = require("../../models/Distributor");

const add_user = async (req, res) => {
  try {
    const { userId } = req.user;

    console.log(userId)

    let user = await User.findById(userId);

    // If user not found in User model, check in Distributor model
    if (!user) {
      user = await Distributor.findById(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found.", status: 401 });
      }
    }

    // Check if user has a company ID
    if (!user.company_id) {
      return res.status(401).json({
        message: "User does not belong to any company.",
        status: 401,
      });
    }

    const {
      email,
      first_name,
      last_name,
      location_id,
      contact_number,
      country_code,
      employee_id,
      job_title,
      assigned_role,
      permissions,
      is_firstaid_certified,
      firstaid_certificate,
      firstaid_certificate_date,
      is_mentally_fit,
      profile_pic,
    } = req.body;

    if (!Validation().email(email)) {
      return res.status(400).json({
        status: 400,
        message: "Email is not valid",
      });
    }

    const { SERVER_BASE_URL } = config;

    const user_data = {};

    user_data.company_id = user.company_id;

    // if (!Validation().email(email)) {
    //   return res.status(400).json("Email is not valid");
    // }

    // if (!Validation().first_name(first_name)) {
    //   return res.status(400).json("First name is not valid");
    // }
    // if (!Validation().last_name(last_name)) {
    //     return res.status(400).json("Last name is not valid");
    //   }

    // if (!Validation().mobile(phone)) {
    //   return res.status(400).json("Phone is not valid");
    // }

    if (email) {
      user_data.email = email;
    }

    if (first_name) {
      user_data.first_name = first_name;
    }

    if (last_name) {
      user_data.last_name = last_name;
    } else {
      user_data.last_name = "";
    }

    if (employee_id) {
      user_data.employee_id = employee_id;
    }else{
      user_data.employee_id = "";
    }

    if (is_mentally_fit) {
      user_data.is_mentally_fit = is_mentally_fit;
    }

    if (job_title) {
      user_data.job_title = job_title;
    }

    if (permissions) {
      user_data.permissions = permissions;
    }

    if (location_id) {
      user_data.location_id = location_id;
    }

    if (contact_number) {
      user_data.contact_number = contact_number;
    }
    if (country_code) {
      user_data.country_code = country_code;
    }

    if (assigned_role) {
      user_data.assigned_role = assigned_role;
user_data.is_approved = true;
    }

 if (user.assigned_role =="rm_superadmin" || user.assigned_role =="rm_admin") {
      user_data.created_by = "rm_superadmin";
    }

    if (user.assigned_role =="distributor_superadmin") {
      user_data.created_by = "distributor_superadmin";
    }

    if (is_firstaid_certified) {
      user_data.is_firstaid_certified = is_firstaid_certified;
    }
    if (firstaid_certificate_date) {
      user_data.firstaid_certificate_date = firstaid_certificate_date;
    } 



      user_data.verified = true;

    const password = password_generator(10);

    const hashPassword = await bcrypt.hash(password, 10);

      user_data.password = hashPassword;


    let transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'noreply@tellarnie.com',
        pass: 'Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz',
      },
    });


    let email_html = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #333;">Hi, ${first_name} ${last_name} </h2>
                        <p>You are receiving this email for registration of your account with Tellarnie</p>

                        <p>your password is: ${email}</p>
                        <p>your password is: ${password}</p>
                        
                        <p>If you did not request this account creation, please ignore this email.</p>
                    </div>
                    `;


  
    if (req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === "profile_pic") {
          const profile_pic_name = file.filename;
          user_data.profile_pic = `${SERVER_BASE_URL}profile_pictures/${profile_pic_name}`;
        }
        if (file.fieldname === "firstaid_certificate") {
          const firstaid_certificate_name = file.filename;
          user_data.firstaid_certificate = `${SERVER_BASE_URL}firstaid_certificates/${firstaid_certificate_name}`;
        }
        // Add more conditions for other file uploads if needed
      });
    }
    
    if(contact_number){
      user_data.contact_number = contact_number;
      user_data.country_code = country_code;
    }else{
      user_data.contact_number = "";
      user_data.country_code = country_code;
    }

    console.log('bdghjdsg',user_data)

    let new_user = await User.create(user_data);

    if (new_user){
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: "noreply@tellarnie.com",
      to: email,
      subject: "Register successfully with Tellarnie ",
      text: `Your registered password is ${password}`,
      html: email_html,
    });
    }

    console.log(new_user._id)

    return res.status(200).json({
      message: `user registered successfully.`,
      user_id: new_user._id,
      status: 200,
    });
  } catch (error) {
    console.log(error)
    if (Validation().validateDuplicacy(error) === true) {
      res.status(500).json({
        message: error.message,
        status: 500,
      });
    } else {
      res.status(401).json({
        message: Validation().validateDuplicacy(error),
        status:401
      });
    }
  }
};

module.exports = add_user;
