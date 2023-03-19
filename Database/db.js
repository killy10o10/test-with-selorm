/**
 * base file for database  configeration and connection
 */


//dependencies
require('dotenv').config()
const {DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const { Sequelize } = require('sequelize')


//db container
const db = {};

//Database setup and configurations
db.sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

//test db connection
db.connect = async () => {
    try {
        await db.sequelize.authenticate()
        console.log('db authentication successful')
    } catch (err) {
        console.error(err)
    }

}



db.close = async () => {
    try {
        await db.sequelize.close();

    } catch (err) {
        console.error(err)

    }
}

module.exports = db;