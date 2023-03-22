/**
 * base file for Todo module
 */

// dependenies
const db = require("../Database/db");
const { DataTypes } = require("sequelize");
const User = require("./User");

// Todo model schema defination
db.sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "low",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      }
    },
  },
  {
    tableName: "Todos",
    indexes: [
      {
        unique: true,
        fields: ["description"],
      },
    ],
  }
);

var Todo = db.sequelize.models.Todo;
module.exports = Todo;
