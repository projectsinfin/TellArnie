const PORT = process.env.PORT || 8081;
const DB_URL = process.env.DB_URL || 'mongodb+srv://fullstackdeveloper710:U7opuaLgqi9JnGCg@cluster0.umzwlum.mongodb.net/?retryWrites=true&w=majority';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'c03d12830b1acb946e8f9d4858d75f6f';
const ACCOUNT_SID = process.env.ACCOUNT_SID || 'AC54119e622785041988adb4a971f9efbe';
const TWILIO_MOBILE_NUMBER = process.env.TWILIO_MOBILE_NUMBER || "+15005550006"
const MAXIMUM_OTP_ATTEMPTS_ALLOWED = process.env.MAXIMUM_OTP_TRY || 3;
const SECRET_KEY = process.env.SECRET_KEY || "this_is_secret_key";
const LOCAL_BASE_URL = process.env.LOCAL_BASE_URL ||  "http://localhost:8081/";

const SERVER_BASE_URL = process.env.SERVER_BASE_URL ||  "https://api.beta.tellarnie.hsvpclubs.com/";

const QR_URL = process.env.QR_URL ||  "https://beta.tellarnie.com/";


module.exports = {PORT,QR_URL, DB_URL,TWILIO_AUTH_TOKEN,ACCOUNT_SID,TWILIO_MOBILE_NUMBER,MAXIMUM_OTP_ATTEMPTS_ALLOWED,SECRET_KEY, LOCAL_BASE_URL, SERVER_BASE_URL}