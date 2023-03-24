/**
 * base file for migration
 */

//dependencies
const User = require("../models/User");
const Todo = require("../models/Todo");
const { DataTypes } = require("sequelize");

//migration container

const migration = {};

//global function for running all migration
migration.runMigration = async function (forceValue) {
  try {
    User.hasMany(Todo,  {foreignKey: {type: DataTypes.UUID,allowNull: false, },onDelete:'CASCADE'} );
    Todo.belongsTo(User, { foreignKey: {type: DataTypes.UUID,allowNull:false},onDelete:'CASCADE'});
    await User.sync({ force: forceValue });
    await Todo.sync({ force: forceValue });
  } catch (err) {
    console.error(err);
  }
};

module.exports = migration;
