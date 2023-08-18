const errorMessages = require('../utils/error_messages')
const axios = require('axios')
const { OpenAI } = require('openai')
const User = require('../models/User')

const validateOpenaiKey = async (req, res, next) => {
    // validateOpenaiKey must always go after requireAuth middleware in router chain
    // we don't need to check if user is null because requireAuth middleware would have caught that

    const openaikey = req.body.openaikey
    
    if (typeof openaikey === 'undefined' || openaikey === null) {
        return res.status(401).json({ error: errorMessages.noOpenaiKeyProvided })
    }

    // check that openai key is a valid openai key
    try {
        const openai = new OpenAI({
            apiKey: openaikey
        })
        
        const userMessage = { role: 'user', content: "test prompt" }
        await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [userMessage],
        });

    } catch (e) { // if error, then openai key is invalid
        return res.status(401).json({ error: 'Validating users openai key failed with following message: ' + e.message })
    }

    next()
}

module.exports = validateOpenaiKey