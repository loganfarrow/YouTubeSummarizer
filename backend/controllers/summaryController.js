const Summary = require('../models/Summary')

exports.fetchAllFromUser = (req, res) => {
    let summaries = []
    summaries = Summary.find({ user: req.params.userId }).sort({ dateCreated: -1 })

    if ('reverse' in req.query) {
        if (req.query.reverse === 'true') {
            summaries.sort({ dateCreated: -1 })
        }
    }
    

    res.status(200).json({ message: 'hello world' })
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

exports.createSummary = (req, res) => {
    // const {name, summary, etc} = req.body

    res.status(200).json({ message: 'hello world' })
}