/**
 * base file for migration
 */

//dependencies
const User = require("../models/User");
const Todo = require("../models/Todo");
const { DataTypes } = require("sequelize");
const util  = require('util')
const debug = util.debuglog('db')

//migration container

const migration = {};

//global function for running all migration
migration.runMigration = async function (forceValue) {
  try {
    await User.hasMany(Todo, {
      foreignKey: { type: DataTypes.UUID, allowNull: false },
      onDelete: "CASCADE",
    });
    await Todo.belongsTo(User, {
      foreignKey: { type: DataTypes.UUID, allowNull: false },
    });
    await User.sync({ force: forceValue });
    await Todo.sync({ force: forceValue });
  } catch (err) {
    debug(err);
  }
};

module.exports = migration;
