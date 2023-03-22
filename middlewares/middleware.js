/**
 * base file for  route middleware
 */

//dependencies
const jwt = require("jsonwebtoken");
require("dotenv");
const { JWT_SECRET } = process.env;

//middleware contaner
var middleware = {};

//protect route
middleware.auth = async function (req, res, next) {
  const token = req.cookies.jwt;
  await jwt.verify(token, JWT_SECRET, function (err, decodedToken) {
    if (!err && decodedToken) {
      next();
    } else {
      var data = {
        errors: {
          unauthorized: "unauthorized, please login",
        },
      };

      res.status(403).redirect('/sign-in')
    }
  });
};

module.exports = middleware;
