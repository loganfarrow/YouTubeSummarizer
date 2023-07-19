const errorMessages = require('../utils/error_messages')
const axios = require('axios')
const User = require('../models/User')

const validateOpenaiKey = async (req, res, next) => {
    // validateOpenaiKey must always go after requireAuth middleware in router chain
    // we don't need to check if user is null because requireAuth middleware would have caught that

    const openaiKey = req.body.openaiKey
    
    if (typeof openaiKey === 'undefined' || openaiKey === null) {
        return res.status(401).json({ error: errorMessages.noOpenaiKeyProvided })
    }

    // check that openai key is a valid openai key
    const response = await axios.get('https://api.openai.com/v1/usage', {
        headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
        }
    });

    // return error if code was invalid
    if (response.status !== 200) {
        return res.status(401).json({ error: errorMessages.invalidOpenaiKeyProvided })
    }

    next()
}

module.exports = validateOpenaiKey