const config = require('../../config/config')
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = config;

const expiry = 30 * 24 * 60 * 60; // 30 days in seconds

function  generateRefreshToken(user) {
    if(user.userId){
      return jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: expiry });
      }else{
      return jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: expiry });
      }
  }

module.exports = generateRefreshToken;