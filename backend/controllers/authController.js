require('dotenv').config()
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
    let user = null
    try {
        user = await User.login(email, password)
    } catch (e) {
        console.error(e.message)
        return res.status(400).json({ e: e.message })
    }
    const token = createToken(user._id)
    res.status(200).json({ email, token })
}

exports.register = async (req, res) => {
    const { email, password } = req.body
    let user = null
    try {
        user = await User.register(email, password)
    } catch (e) {
        console.error(e.message)
        return res.status(400).json({ e: e.message })
    }
    const token = createToken(user._id)
    res.status(200).json({ email, token })
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
            console.error(e.message)
            res.status(400).json({ e: e.message })
        })
}

exports.fetchUser = async (req, res) => {
    // return email, date created
    const { userId } = req

    const user = await User.findOne({ _id: userId })

    if (!user) {
        return res.status(400).json({ e: errorMessages.userDoesNotExistForId })
    }

    // we use toIsoString because if the frontend has an ISO formatted string they 
    // can get a date object by just passing the ISO string to the date constructor
    res.status(200).json({ email: user.email, dateCreated: user.dateCreated.toISOString() })
}

exports.updatePassword = async (req, res) => {
    const { userId } = req
    const { newPassword } = req.body

    if (!newPassword) {
        return res.status(400).json({ e: errorMessages.newPasswordRequired })
    }

    const user = await User.findOne({ _id: userId })
    if (!user) {
        return res.status(400).json({ e: errorMessages.userDoesNotExistForId })
    }

    try {
        await user.updatePassword(newPassword)
        res.status(200).json({ message: 'Successfully updated password for user with id: ' + userId })
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ e: e.message })
    }
}

exports.updateEmail = async (req, res) => {
    const { userId } = req
    const { newEmail } = req.body

    const user = await User.findOne({ _id: userId })
    if (!user) {
        return res.status(400).json({ e: errorMessages.userDoesNotExistForId })
    }

    try {
        await user.updateEmail(newEmail)
        res.status(200).json({ message: 'Successfully updated email for user with id: ' + userId })
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ e: e.message })
    }
}

exports.deleteUser = async (req, res) => {
    const { userId } = req

    User.deleteOne({ _id: userId })
        .then((result) => {
            if (result.deletedCount === 0) {
                res.status(400).json({ e: errorMessages.attemptedToDeleteUserThatDoesntExist })
            }
            return res.status(200).json({ message: 'Successfully deleted user with id: ' + userId })
        })
        .catch((e) => {
            console.error(e.message)
            res.status(400).json({ e: errorMessages.failedToDeleteUser })
        })
}
