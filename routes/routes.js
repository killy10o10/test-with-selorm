/**
 * base file for routes
 */


//dependencies
const { Router } = require('express')
const homeController = require('../controllers/HomeController')
const userController = require('../controllers/UserController')

//initialize router 
const router = Router();


//http verb GET for home
router.get("/", homeController.get)
router.get('/sign-up', userController.get)
router.post('/sign-up', userController.post)




module.exports = router;