/**
 * base file for user controller
 */

//Dependencies
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { JWT_SECRET } = process.env;

const errorHandler = function (err) {
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
    return [false, errors];
  }
};

const maxAge = 1000 * 60 * 60 * 12;

const createToken = function (user_id) {
  var token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: maxAge });
  return token;
};

module.exports.signup_get = function (req, res) {
  const data = { title: "Todo App - Sign Up" };
  res.status(200).json({ data: data });
};

module.exports.signup_post = async function (req, res) {
  const { username = "", password = "", tosAgreement = false } = req.body;
  const user = { username, password, tosAgreement };
  //validate user data
  var errors = { username: "", password: "", tosAgreement: "" };

  if (user.username.trim().length <= 0) {
    errors.username = new Error("username is required");
  }
  if (user.password.trim().length <= 6) {
    errors.password = new Error(
      "password should be at least 6 characters long"
    );
  }
  if (user.tosAgreement == false) {
    errors.tosAgreement = new Error("tosAgreement is required");
  }
  var error = errorHandler(errors);
  if (error[0]) {
    res.status(403).json({ errors: error[1] });
  } else {
    //hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    try {
      const { username, id } = await User.create(user);
      //create jwt oken
      const token = createToken(id);
      res.cookie("jwt", token, { maxAge: maxAge, httpOnly: true });
      res.cookie("jwt_exist", true, { maxAge: maxAge });
      req.session.user = { id: id, username: username };
      res.status(201).json({ user: { username, id } });
    } catch (err) {
      error = errorHandler(err);
      res.status(403).json({ errors: error[1] });
    }
  }
};
module.exports.signin_get = async function (req, res) {
  const data = { title: "Todo App - Sign In" };
  res.status(200).json({ data: data });
};

module.exports.signin_post = async function (req, res) {
  const { username = "", password = "" } = req.body;
  const user = { username, password };
  //validate user data
  var errors = { username: "", password: "" };
  if (user.username.trim().length <= 0) {
    errors.username = new Error("username is required");
  }
  if (user.password.trim().length <= 6) {
    errors.password = new Error("password is required");
  }
  var error = errorHandler(errors);
  if (error[0]) {
    res.status(403).json({ errors: error[1] });
  } else {
    var result = await User.findOne({
      where: { username: user.username },
      attributes: ["id", "username", "password"],
    });
    if (result != null) {
      //compare password
      var isPassword = await bcrypt.compare(user.password, result.password);

      if (isPassword) {
        //assign a jwt token  to user
        var token = createToken(result.id);
        res.cookie("jwt", token, { maxAge: maxAge, httpOnly: true });
        res.cookie("jwt_exist", true, { maxAge: maxAge });
        delete result.password;
        req.session.user = result.toJSON();
        const data = {
          id: result.id,
          username: result.username,
          password: result.password,
        };
        res.status(200).json({ user: data });
      } else {
        res.status(401).json({errors:{ password: "invalid password" }});
      }
    } else {
      var data = {
        errors: { username: "username not found" },
      };
      res.status(404).json(data);
    }
  }
};

module.exports.logout = function (req, res) {
  res.cookie("jwt", "", { maxAge: 0 });
  res.cookie("jwt_exist", true, { maxAge: 0 });
  res.status(200).json({data:"user logged out"});
};
