/**
 * base file for routes
 */

//dependencies
const { Router } = require("express");
const homeController = require("../controllers/HomeController");
const userController = require("../controllers/UserController");
const todoController = require("../controllers/TodoController");
const middleware = require("../middlewares/middleware");

//initialize router
const router = Router();

// Define the routes and associate them with the appropriate controllers

// The home page route
router.get("/", homeController.get);

// The sign-up page routes
router.get("/sign-up", userController.signup_get);
router.post("/sign-up", userController.signup_post);

// The sign-in page routes
router.get("/sign-in", userController.signin_get);
router.post("/sign-in", userController.signin_post);

// The logout route
router.get("/logout", userController.logout);

// The dashboard route, which requires authentication middleware
router.get("/dashbord", middleware.auth, todoController.dashbord);
router.post("/dashbord", middleware.auth, todoController.post);

module.exports = router;
