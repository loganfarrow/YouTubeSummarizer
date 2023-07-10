require('dotenv').config()
const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.post('/createUser', userController.createUser)
router.delete('/:userId(\\d+)', userController.deleteUser)
router.patch('/:userId(\\d+)', userController.updateUser)
router.delete('/:userId(\\d+)', userController.deleteUser)

module.exports = router