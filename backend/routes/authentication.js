// TODO figure out authentication endpoints

require('dotenv').config()
const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/login', authController.login)

router.post('/register', authController.register)

router.patch('/updatePassword', authController.updatePassword)

router.patch('/updateEmail', authController.updateEmail)

router.patch('/deleteUser', authController.deleteUser)

module.exports = router