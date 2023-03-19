# node-express-sequelize-jwt-mysql-crud
Welcome to my repository where I've built a simple CRUD application using Node.js, Express.js, EJS, JWT, and Sequelize with MySQL as the database dialect. This application allows users to create, read, update, and delete records in a MySQL database.

The application uses the JWT authentication mechanism to protect certain routes and ensure secure access to data. I've also utilized Sequelize, a popular Object-Relational Mapping (ORM) library, to define database models and manage database operations.

This repository includes all the necessary files, including the server-side code, configuration files, and views built using EJS templating. I've also included a clear and concise README file that provides instructions on how to set up and run the application on your local machine.

Feel free to clone and explore the repository to see how I've implemented the CRUD functionality and used various technologies to build a simple yet powerful web application

Node.js CRUD app w/ JWT auth &amp; MySQL. Built with Express &amp; Sequelize. Clone &amp; run locally using npm start command. See README for setup instructions.


Clone & Run Locally
Clone this repository to your local machine using the command:
bash

git clone https://github.com/username/node-express-sequelize-jwt-mysql-crud.git
Navigate to the project directory:
bash

cd node-express-sequelize-jwt-mysql-crud
Install the project dependencies:

npm install
Create a new MySQL database and update the database configuration file at config/database.js with your MySQL credentials.

Run the database migrations:


npx sequelize-cli db:migrate
Start the server:
sql

npm start
Access the app in your web browser at http://localhost:3000.
That's it! You should now be able to use the Node.js CRUD app with JWT authentication and MySQL database on your local machine.
