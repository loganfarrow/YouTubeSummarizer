const User = require('../models/User')
const errorMessages = require('../utils/error_messages')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    // this token never expires (user never forced to log out)
    return jwt.sign({ _id }, process.env.JWT_SECRET)
}

exports.login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({ email, user, token })
    } catch (e) {
        res.status(400).json({e: e.message})
    } 
}

exports.register = async (req, res) => {
    const {email, password } = req.body

    try {
        const user = await User.register(email, password)
        const token = createToken(user._id)
        res.status(200).json({ email, user, token })
    } catch (e) {
        res.status(400).json({ e: e.message })
    }
}

exports.updateOpenAiKey = async (req, res) => {
    res.status(200).json({ message: 'updateOpenAiKey endpoint not implemented yet' })
}

exports.updatePassword = async (req, res) => {
    res.status(200).json({ message: 'updatePassword endpoint not implemented yet' })
}

exports.updateEmail = async (req, res) => {
    res.status(200).json({ message: 'updateEmail endpoint not implemented yet' })
}

exports.deleteUser = async (req, res) => {
    res.status(200).json({ message: 'deleteUser endpoint not implemented yet' })
}
