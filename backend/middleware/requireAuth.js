const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const errorMessages = require('../utils/error_messages')
const User = require('../models/User')

const requireAuth = async (req, res, next) => {
    // extract authorization header from request
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: errorMessages.authorizationRequired })
    }

    // extract token from authorization header
    // we remove the 'Bearer ' part of the authorization header that comes before the token
    const token = authorization.replace('Bearer ', '')

    // verify token is valid (hasn't changed)
    try {
        const { _id } = await jwt.verify(token, process.env.JWT_SECRET)
        // attach the user id to the request object so we can access it in the next middleware (or route, if this is last middleware)

        const user = await User.findById(_id)
        if (!user) {
            return res.status(401).json({ error: errorMessages.unauthorizedToken })
        }

        req.userId = user._id
    } catch (e) {
        console.log(e)
        return res.status(401).json({ error: errorMessages.unauthorizedToken })
    }

    if (typeof req.userId === 'undefined' || req.userId === null) {
        return res.status(401).json({ error: errorMessages.unauthorizedToken })
    }

    next()
}

module.exports = requireAuth