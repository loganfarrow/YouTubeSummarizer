// TODO figure out authentication endpoints

require('dotenv').config()
const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/login', authController.login)

router.post('/register', authController.register)

router.get('/logout', authController.logout)

module.exports = router