/**
 * base file for migration
 */

//dependencies
const User = require("../models/User");
const Todo = require("../models/Todo");

//migration container

const migration = {};

//global function for running all migration
migration.runMigration = async function (forceValue) {
  try {
    await User.sync({ force: forceValue });
    await Todo.sync({ force: forceValue });
  } catch (err) {
    console.error(err);
  }
};

module.exports = migration;
