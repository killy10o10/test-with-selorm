/**
 * base file for  utilities
 */

// dependencies
require('dotenv').config()
const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken')

const util = {};

util.errorHandler = function (err) {
  var errors = { username: null, password: null, tosAgreement: null };
  if (err.name) {
    errors.username = "user with the same name exist already";
    return [true, errors];
  }

  Object.keys(err).forEach((e) => {
    errors[e] = err[e].message;
  });
  if (errors.username || errors.password || errors.tosAgreement) {
    return [true, errors];
  } else {
    return [false,errors];
  }
};

const maxAge = 1000 * 60 * 60 * 12;
util.createToken = function (user_id) {
  var token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: maxAge });
  return token;
};

module.exports = util;
