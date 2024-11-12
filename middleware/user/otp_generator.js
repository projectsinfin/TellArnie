function otp_generator() {
  let randomNumber;
  do {
    randomNumber = Math.floor(100000 + Math.random() * 900000);
  } while (/[0]/.test(randomNumber.toString()));
  return randomNumber;
}

module.exports = otp_generator;
