/**
 * base file for User model
 */

//dependencies
const db = require('../Database/db')
const { DataTypes } = require('sequelize')

//user model schema defination 
db.sequelize.define("User", {

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tosAgreement: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},

    {
        tableName: 'Users',
        indexes:[{
            unique:true,
            fields:['username']
        }]
    },
   
)

var User = db.sequelize.models.User;

module.exports = User;
