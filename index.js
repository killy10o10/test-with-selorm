/**
 *base file for app
 */

//dependencies
const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const { PORT } = process.env;
const path = require('path')
const router = require('./routes/routes')
const db = require('./Database/db')
const migration  = require('./Database/migration')





//iinitilize express app

const app = express();


//set up view engine
app.set("view engine", 'ejs');
app.set("views", path.resolve(__dirname, 'views'))


// test connection to db
db.connect();
//run migrations
migration.runMigration(false);

//set up middlewares
app.use(express.json())
app.use(cookieParser())
app.use(router)





//start server and listen on specific port
app.listen(PORT, () => { console.log(`server is up and runing on port ${PORT}`); })