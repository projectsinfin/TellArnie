const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Token = require('../src/models/Token');

const { SECRET_KEY } = config;

async function authenticateToken(req, res, next) {
  const header_token = req.header('Authorization');
  console.log(header_token,'acess token');
  const tokenArray = header_token.split(' ');
  const token = tokenArray[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    // const foundToken = await Token.findOne({ token: token });

    // if (!foundToken) {
    //   return res.status(401).json({ message: 'Access denied' });
    // }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

module.exports = authenticateToken;
