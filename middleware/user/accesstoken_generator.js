const config = require('../../config/config')
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = config;

function generateAccessToken(user) {

    if(user.userId){
    return jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '8h' });
    }else{
    return jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '8h' });
    }
  }

module.exports = generateAccessToken;