/**
 * base file for user controller
 */

//Dependencies
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { render } = require("ejs");
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
  res.render("auth/sign-up", { data });
};

module.exports.signup_post = async function (req, res) {
  const user = ({ username, password, tosAgreement } = req.body);
  //validate user data
  var errors = { username: "", password: "", tosAgreement: "" };

  if (user.username.trim().length <= 0) {
    errors.username = new Error("username is required");
  }
  if (user.password.trim().length <= 6) {
    errors.password = new Error("password is required");
  }
  if (user.tosAgreement == false) {
    errors.tosAgreement = new Error("tosAgreement is required");
  }
  var error = errorHandler(errors);
  console.log(error);
  if (error[0]) {
    res.status(403).json({ errors: error[1] });
  } else {
    //hash password
    var salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    try {
      const newUser = await User.create(user);
      //create jwt oken
      const token = createToken(newUser.id);
      res.cookie("jwt", token, { maxAge: maxAge, httpOnly: true });
      res.cookie("jwt_exist", true, { maxAge: maxAge });
      req.session.user = { id: newUser.id, username: newUser.username };
      console.log(req.session.user);
      res.status(201).json({ user: newUser.username });
    } catch (err) {
      error = errorHandler(err);
      res.status(403).json({ errors: error[1] });
    }
  }
};
module.exports.signin_get = async function (req, res) {
  const data = { title: "Todo App - Sign In" };
  res.render("auth/sign-in", { data });
};

module.exports.signin_post = async function (req, res) {
  const user = ({ username, password } = req.body);
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
        var data = {
          user: result.username,
        };
        res.status(200).json(data);
      } else {
        var data = {
          errors: { password: "invalid password" },
        };
        res.status(403).json(data);
      }
    } else {
      var data = {
        errors: { username: "username not found" },
      };
      res.status(403).json(data);
    }
  }
};

module.exports.logout = function (req, res) {
  res.cookie("jwt", "", { maxAge: 0 });
  res.cookie("jwt_exist", true, { maxAge: 0 });
  res.status(200).redirect("/");
};
