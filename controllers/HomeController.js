/**
 * base file for home controller
 */

//Dependencies
const Todo = require;

const description = `
Welcome to MyApp, a simple CRUD application built with Node.js
Express, EJS, JWT, and Sequelize wit
MySQL as the database. With MyApp, you can easily Create, Read, Update,
and Delete data stored in th
database using a user-friendly web interface
MyApp uses JWT authentication to secure the endpoints and
prevent unauthorized access.
The app is designed to be scalable and modular, allowing you to easily add
new features and customize it to your needs.
Try MyApp today and see how easy it is to manage your data!`;
module.exports.get = function (req, res) {
  const data = { title: "Todo App - Home", description: description };
  res.render("home", { data });
};


