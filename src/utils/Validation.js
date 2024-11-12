const {
    emailRegex,
    firstnameRegex,
    lastnameRegex,
    passwordRegex,
    phonenumberRegex,
  } = require("./validation_regex");
  
  const Validation = () => {
    function email(email) {
      const isValidEmail = emailRegex.test(email);
  
      if (isValidEmail) {
        return true;
      } else {
        return false;
      }
    }
    function first_name(first_name) {
      console.log(first_name);
      const isValidFullName = firstnameRegex.test(first_name);
  
      if (isValidFullName) {
        return true;
      } else {
        return false;
      }
    }
    function last_name(last_name) {
      console.log(last_name);
      const isValidFullName = lastnameRegex.test(last_name);
  
      if (isValidFullName) {
        return true;
      } else {
        return false;
      }
    }
    function password(password) {
      const isValidPassword = passwordRegex.test(password);
  
      console.log(isValidPassword, "-password");
  
      if (isValidPassword) {
        return true;
      } else {
        return false;
      }
    }
  
    function mobile(phonenumber) {
      const isValidMobile = phonenumberRegex.test(phonenumber);
  
      if (isValidMobile) {
        return true;
      } else {
        return false;
      }
    }
  
    function validateDuplicacy(error) {
      if (error.code === 11000) {
        return `${Object.values(error.keyValue)} already exists`;
      } else {
        return true;
      }
    }
    return {
      email: email,
      first_name: first_name,
      last_name:last_name,
      password: password,
      validateDuplicacy: validateDuplicacy,
      mobile: mobile,
    };
  };
  
  module.exports = Validation;
  