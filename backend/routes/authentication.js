// TODO figure out authentication endpoints

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

router.get('/fetchUser', authController.fetchUser)

router.patch('/updateOpenAiKey', authController.updateOpenAiKey)

router.patch('/updatePassword', authController.updatePassword)

router.patch('/updateEmail', authController.updateEmail)

router.patch('/deleteUser', authController.deleteUser)

module.exports = router