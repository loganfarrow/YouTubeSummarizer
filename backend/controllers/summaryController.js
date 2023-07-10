const e = require('express')
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

exports.fetchSummary = async (req, res) => {
    try {
        const summaryId = req.params.summaryId
        const summary = await Summary.findById(summaryId)
        res.status(200).json(summary)
    } catch(e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while getting summary: ' + e.message })
    }
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

exports.deleteSummary = async (req, res) => {
    try {
        const summaryId = req.params.summaryId
        await Summary.findByIdAndRemove(summaryId, (err, deletedSummary) => {
            if (!deletedSummary) { res.status(404).json({ error: 'Summary not found' }) }
        })
        res.status(200).json({ message: 'Successfully deleted summary' })
    } catch(e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while deleting summary: ' + e.message })
    }
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