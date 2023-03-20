/**
 * base file for user controller
 */

//Dependencies
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const { JWT_SECRET } = process.env;


const errorHandler = function (err) {
    var errors = { username: null, password: null, tosAgreement: null }
    if (err.name) {
        errors.username = "user with the same name exist already";
        return [true, errors]
    }
    
    Object.keys(err).forEach((e) => {
        errors[e] = err[e].message
    })
    if (errors.username || errors.password || errors.tosAgreement) {
        return [true, errors]
    } else {
        return [false, errors]
    }
}

const maxAge = 1000 * 60 * 60 * 12;

const createToken = function (user_id) {
    var token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: maxAge })
    return token;
}


module.exports.get = function (req, res) {
    res.render('sign-up')
}


module.exports.post = async function (req, res) {
    const user = { username, password, tosAgreement } = req.body;
    //validate user data
    var errors = { username: '', password: '', tosAgreement: '' }


    if (user.username.trim().length <= 0) {
        errors.username = new Error('username is required')
    }
    if (user.password.trim().length <= 6) {
        errors.password = new Error('password is required')
    }
    if (user.tosAgreement == false) {
        errors.tosAgreement = new Error('tosAgreement is required')
    }
    var error = errorHandler(errors)
    console.log(error)
    if (error[0]) {
        res.status(403).json({ errors: error[1] })
    } else {
        //hash password
        var salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt)
        try {
            const newUser = await User.create(user);
            //create jwt oken
            const token = createToken(newUser.id)
            res.cookie('jwt', token, { maxAge: maxAge, httpOnly: true })
            res.status(201).json({ user: newUser.id })
        } catch (err) {
            error = errorHandler(err)
            res.status(403).json({ errors: error[1] })

        }

    }

}













