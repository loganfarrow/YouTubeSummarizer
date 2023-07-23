require('dotenv').config()
const express = require('express')
const authController = require('../controllers/authController')
const requireAuth = require('../middleware/requireAuth')
const validateOpenaiKey = require('../middleware/validateOpenaiKey')

const router = express.Router()

// apply requireAuth middleware to routes that require authentication
const routesNeedingAuth = ['/updateOpenAiKey', '/updatePassword', '/updateEmail', '/deleteUser', '/fetchUser']
const routesNeedingValidateOpenaiKey = ['/updateOpenAiKey']

router.use(routesNeedingAuth, requireAuth)
router.use(routesNeedingValidateOpenaiKey, validateOpenaiKey)

router.post('/login', authController.login)

router.post('/register', authController.register)

// get email and date created of user
router.get('/fetchUser', authController.fetchUser)

// update user's openai key (also checks that new key is a valid openai key)
router.patch('/updateOpenAiKey', authController.updateOpenAiKey)

// checks that new password is strong, not equal to current password, and updates user's password
router.patch('/updatePassword', authController.updatePassword)

router.patch('/updateEmail', authController.updateEmail)

router.delete('/deleteUser', authController.deleteUser)

module.exports = router