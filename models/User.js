/**
 * base file for User model
 */

//dependencies
const db = require("../Database/db");
const { DataTypes } = require("sequelize");

//user model schema defination
db.sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Username field is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Pasword field is required",
        },
      },
    },
    tosAgreement: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Pasword field is required",
        },
      },
    },

  },

  {
    tableName: "Users",

    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }

);

var User = db.sequelize.models.User;

module.exports = User;
