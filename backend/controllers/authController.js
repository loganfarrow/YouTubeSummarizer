const User = require('../models/User')
const errorMessages = require('../utils/error_messages')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const axios = require('axios')

const createToken = (_id) => {
    // this token never expires (user never forced to log out) (can set this later if needed)
    return jwt.sign({ _id }, process.env.JWT_SECRET)
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({ email, user, token })
    } catch (e) {
        res.status(400).json({ e: e.message })
    }
}

exports.register = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.register(email, password)
        const token = createToken(user._id)
        res.status(200).json({ email, user, token })
    } catch (e) {
        res.status(400).json({ e: e.message })
    }
}

exports.updateOpenAiKey = async (req, res) => {
    const { userId } = req
    const { openaiKey } = req.body

    // new: true lets us get the updatedUser object when promise returns
    await User.findByIdAndUpdate(userId, { openai_key: openaiKey }, { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                throw new Error(errorMessages.userDoesNotExistForId)
            } else {
                res.status(200).json({ message: 'Successfully updated openai key for user with id: ' + userId })
            }
        })
        .catch((e) => {
            res.status(400).json({ e: e.message })
        })
}

exports.fetchUser = async (req, res) => {
    // return email, date created
    const { userId } = req

    const user = User.findById(userId)
    if (!user) {
        res.status(400).json({ e: errorMessages.userDoesNotExistForId })
    }

    // we use toIsoString because if the frontend has an ISO formatted string they 
    // can get a date object by just passing the ISO string to the date constructor
    res.status(200).json({ email: user.email, dateCreated: user.date_created.toISOString() })
}

exports.updatePassword = async (req, res) => {
    const { userId } = req
    const { newPassword } = req.body
    
    if (!newPassword) {
        res.status(400).json({ e: 'newPassword is required in request body'})
    }

    try {
        User.updatePassword(userId, newPassword)
        res.status(200).json({ message: 'Successfully updated password for user with id: ' + userId })
    } catch (e) {
        res.status(400).json({ e: e.message })
    }
}

exports.updateEmail = async (req, res) => {
    // PATCH
    res.status(200).json({ message: 'updateEmail endpoint not implemented yet' })
}

exports.deleteUser = async (req, res) => {
    // DELETE
    res.status(200).json({ message: 'deleteUser endpoint not implemented yet' })
}
