/**
 * base file for routes
 */

//dependencies
const { Router } = require("express");
const homeController = require("../controllers/HomeController");
const userController = require("../controllers/UserController");
const middleware = require('../middlewares/middleware')

//initialize router
const router = Router();

//http verb GET for home
router.get("/", homeController.get);
router.get("/sign-up", userController.signup_get);
router.post("/sign-up", userController.signup_post);
router.get('/sign-in', userController.signin_get)
router.post('/sign-in', userController.signin_post)
router.get('/logout',userController.logout)
router.get('/dashbord', middleware.auth, userController.dashbord)

module.exports = router;
