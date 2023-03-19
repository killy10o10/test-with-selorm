/**
 * base file for routes
 */


//dependencies
const { Router } = require('express')
const homeController  = require('../controllers/HomeController')


//initialize router 
const router = Router();


//http verb GET for home
router.get("/",homeController.get)



module.exports = router;