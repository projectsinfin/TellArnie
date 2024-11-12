const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const firstnameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/;
const lastnameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
const phonenumberRegex =  /^[+]?[0-9]{1,3}?[-.\\s]?[(]?[0-9]{1,4}[)]?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}$/;

module.exports = {emailRegex, firstnameRegex,lastnameRegex, passwordRegex , phonenumberRegex}
