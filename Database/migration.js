/**
 * base file for migration
 */

//dependencies
const User = require('../models/User')

//migration container 

const migration = {};


//global function for running all migration
migration.runMigration = async function () {
    try {
        User.sync();


    } catch (err) {

        console.error(err);

    }

}

module.exports = migration;