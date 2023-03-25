/**
 *base file for app
 */

//dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { PORT, SESSION_SECRET } = process.env;
const path = require("path");
const router = require("./routes/routes");
const db = require("./Database/db");
const migration = require("./Database/migration");
const session = require("express-session");

//iinitilize express app

const app = express();

app.use(express.static("public"));

//set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// test connection to db
db.connect();
//run migrations
migration.runMigration(true);

//set up middlewares
app.use(express.json());
app.use(cookieParser());

//set up session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge:1000*60*60*12}
  })
);
app.use(router);

//start server and listen on specific port
app.listen(PORT, () => {
  console.log(`server is up and runing on port ${PORT}`);
});
