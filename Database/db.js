/**
 * base file for database  configeration and connection
 */

//dependencies
require("dotenv").config();
const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const { Sequelize } = require("sequelize");
const util  = require('util')
const debug = util.debuglog('db')

//db container
const db = {};

//Database setup and configurations
db.sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  logging:{}
});

//test db connection
db.connect = async () => {
  try {
   await db.sequelize.authenticate();
  } catch (err) {
   debug(err);
  }
};

db.close = async () => {
  try {
   await db.sequelize.close();
  } catch (err) {
     debug(err);
  }
};

module.exports = db;
