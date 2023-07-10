const Summary = require('../models/Summary')
const User = require('../models/User')

exports.fetchAllFromUser = async (req, res) => {
    // fetch all from user in chronological order
    let summaries = []
    try {
        summaries = await Summary.find({ user: req.params.userId }).sort({ dateCreated: 1 })

        // reverse date order if requested
        if ('reverse' in req.query) {
            if (req.query.reverse === 'true') {
                summaries.sort({ dateCreated: -1 })
            }
        }
    }
    catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while getting users summaries: ' + e.message })
    }

    console.log(summaries)

    res.status(200).json(summaries)
}

exports.fetchOneFromUser = (req, res) => {
    res.status(200).json({ message: 'hello world' })
}

exports.findSummaryFromText = (req, res) => {
    let searchText = req.query('searchText').toString()
    if (!searchText.isString()) {
        res.status(400).json({ error: 'The summary search query must be a string' })
    }
    res.status(200).json({ message: 'hello world' })
}

exports.updateSummaryTitle = (req, res) => {
    res.status(200).json({ message: 'hello world' })
}

exports.deleteSummary = (req, res) => {
    res.status(200).json({ message: 'hello world' })
}

exports.createSummary = async (req, res) => {
    const { title, summary, options } = req.body
    const userId = req.params.userId
    const dateCreated = new Date()

    let user = null
    try {
        user = await User.findById(userId)
    }
    catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while getting user: ' + e.message })
    }
    
    let optionsJSON = ''
    try {
        optionsJSON = JSON.parse(options)
    } catch {
        console.error('UNable to parse summary options dictionary to JSON')
    }

    let savedSummary = null
    try {
        const newSummary = new Summary({
            title: title,
            summary: summary,
            options: optionsJSON,
            dateCreated: dateCreated,
            user: user
        })
        savedSummary = await newSummary.save()
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while saving summary: ' + e.message })
    }

    res.status(200).json({
        message: 'Summary successfully created',
        summary: savedSummary
    })
}