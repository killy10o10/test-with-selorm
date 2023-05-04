/**
 * base file for database  configeration and connection
 */

//dependencies
require("dotenv").config();
const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const { Sequelize } = require("sequelize");
const util  = require('util')
const debug = util.debuglog('db')
const path  = require('path')


//db container
const db = {};
const basePath  = path.join(__dirname+'./db.sqlite')

//Database setup and configurations
db.sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  dialect: 'sqlite',
  storage: basePath,

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
