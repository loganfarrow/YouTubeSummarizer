const Summary = require('../models/Summary')
const User = require('../models/User')
const Options = require('../models/Options')
const errorMessages = require('../utils/error_messages')
const axios = require('axios')
const { OpenAI } = require('openai')
const { getPrompt, customInstructions } = require('../utils/prompting')
const { parseTitle } = require('../utils/helpers')

exports.fetchAllFromUser = async (req, res) => {
    // returns oldest first by default, returns most recent first if the url param mostRecent === 'true'
    const mostRecent = req.query.mostRecent || 'false'  // mostRecent is a string (can't pass a bool through url params)

    try {
        let user = await User.findById(req.userId)
    } catch (e) {
        return res.status(400).json(errorMessages.userDoesNotExistForId)
    }

    let summaries = []
    try {
        summaries = (mostRecent === 'true') ?
            await Summary.find({ user: req.userId }).sort({ createdAt: -1 }).exec() :
            await Summary.find({ user: req.userId }).sort({ createdAt: 1 }).exec()
    }
    catch (e) {
        return res.status(400).json({ error: 'The following error occurred while getting users summaries: ' + e.message })
    }

    return res.status(200).json(summaries)
}

exports.fetchSummary = async (req, res) => {
    try {
        const summaryId = req.query.summaryId.toString()
        const summary = await Summary.findById(summaryId)
        if (!summary) {
            return res.status(404).json({ error: errorMessages.summaryNotFound })
        }
        return res.status(200).json(summary)
    } catch (e) {
        return res.status(400).json({ error: 'The following error occurred while getting summary: ' + e.message })
    }
}

exports.findSummaryFromTitle = async (req, res) => {
    let searchText = ''
    try {
        searchText = req.query.searchText.toString()
    }
    catch (e) {
        return res.status(400).json({ error: errorMessages.searchTextIncorrectlyFormatted })
    }

    let user = null
    try {
        user = await User.findById(req.userId)
    } catch (e) {
        return res.status(400).json({ error: errorMessages.noUserForSummary })
    }

    let matchingSummaries = []
    try {
        matchingSummaries = await Summary.find({ user: user, title: { $regex: RegExp(searchText, 'i') } }) // i = case insensitive
    }
    catch (e) {
        return res.status(400).json({ error: 'The following error occurred while searching users summaries: ' + e.message })
    }

    return res.status(200).json({ summaries: matchingSummaries })
}

exports.deleteSummary = async (req, res) => {
    try {
        const { summaryId } = req.body

        const deletedSummary = await Summary.findByIdAndRemove(summaryId, { new: true })
        if (!deletedSummary) {
            return res.status(404).json({ error: errorMessages.summaryNotFound })
        }

        return res.status(200).json({ message: 'Successfully deleted summary' })
    } catch (e) {
        return res.status(400).json({ error: 'The following error occurred while deleting summary: ' + e.message })
    }
}

exports.generateSummary = async (req, res) => {
    // generating and creating the summary should be handled in the same endpoint

    // get the userId, return error if user/userId invalid
    const userId = req.userId

    let user = null
    try {
        user = await User.findById(userId)
    } catch (e) {
        return res.status(400).json({ error: 'The following error occurred while getting user: ' + e.message })
    }

    // check that user has an associated openai key and that it is valid, return error if not
    // note: we check that keys are valid when user is created or they update their key, but we need to check that they're sitll valid before using them
    if (user.openai_key === undefined || !user.openai_key) {
        return res.status(401).json({ error: errorMessages.userHasNoOpenaiKey })
    }
    
    // check that openai key is a valid openai key
    try {
        const openai = new OpenAI({
            apiKey: user.openai_key
        })
        
        const userMessage = { role: 'user', content: "test prompt" }
        await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [userMessage],
        });

    } catch (e) { // if error, then openai key is invalid
        return res.status(401).json({ error: 'Validating users openai key failed with following message: ' + e.message })
    }

    // get the options from request body, attempt to create options object, error if invalid
    let options = {}
    try {
        const { options: optionsDict } = req.body
        options = await Options.createNewOptions(optionsDict)
        options.save()
    } catch (e) {
        return res.status(400).json({ error: 'The following error occurred while creating options dictionary: ' + e.message + '/n' + errorMessages.ensureValidOptions })
    }

    // call a helper function here that gets prompt based on user's options
    let prompt = ''
    let url = ''
    try {
        const { url: _url } = req.body
        url = _url
        prompt = await getPrompt(options, url)
    } catch (e) {
        return res.status(400).json({ error: 'The following error occurred while generating prompt from user-selected options: ' + e.message })
    }

    // call openai api with prompt and key
    const systemMessage = { role: 'system', content: customInstructions }
    const userMessage = { role: 'user', content: prompt }
    let summary = ''
    try {
        const openai = new OpenAI({
            apiKey: user.openai_key
        })

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemMessage, userMessage],
            temperature: 0.32 // we use a lower value to get a more deterministic & predictable (less random) output
        });
        summary = response.choices[0].message.content
    } catch (e) {
        return res.status(401).json({ error: 'call to openai api to generate summary failed with error: ' + e.message})
    }

    if (summary === '') {
        return res.status(401).json({ error: 'summary returned from openai api was empty' })
    }

    // get the sumary's title from the summary text
    const title = parseTitle(summary)

    // create summary object with the response and save it to the database
    let savedSummary = null
    try {
        const newSummary = new Summary({
            title: title,
            summary: summary,
            options: options,
            user: user,
            video_url: url, // we don't need to check if this is a valid url because generateSummary would have already failed
        })
        savedSummary = await newSummary.save()
    } catch (e) {
        return res.status(400).json({ error: 'The following error occurred while saving summary: ' + e.message })
    }

    return res.status(200).json({
        message: 'Summary successfully created',
        summary: savedSummary
    })
}


// this is unnecessary, only saving this if we want to refactor it in the future
// to allow somebody to edit the options on a summary and thereby regenerate it
exports.updateSummary = async (req, res) => {
    try {

        // since each parameter is optional (except the id), we want to set them to null if not provided (else they will be undefined)
        const { summaryId, newTitle = null, newSummary = null, newOptionsDict = null } = req.body

        if (!newTitle && !newSummary && !newOptionsDict) {
            return res.status(400).json({ error: errorMessages.noUpdateFields })
        }

        const summary = await Summary.findById(summaryId)
        if (!summary) {
            return res.status(404).json({ error: errorMessages.summaryNotFound })
        }

        // need to create the new Options object if we are updating
        // should also delete the old options object if we are updating
        let newOptions = null
        if (newOptionsDict) {
            try {
                newOptions = await Options.createNewOptions(newOptionsDict)
                newOptions.save()
            } catch (e) {
                return res.status(400).json({ error: errorMessages.failedToParseOptions })
            }

            await Options.findByIdAndRemove(summary.options._id)

            // update the summary with the new options object
            await Summary.findByIdAndUpdate(summaryId, { options: newOptions }, { new: true })
        }

        // we update the fields that are provided and leave the rest the same (a || b means if a is null we use b)
        await Summary.findByIdAndUpdate(summaryId, {
            title: newTitle || summary.title,
            summary: newSummary || summary.summary,
            options: newOptions || summary.options,
        }, { new: true })

        return res.status(200).json({ message: 'Successfully updated summary', updatedSummary: summary })
    }
    catch (e) {
        return res.status(400).json({ error: 'The following error occurred while updating summary title: ' + e.message })
    }
}