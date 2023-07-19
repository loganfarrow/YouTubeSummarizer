const Summary = require('../models/Summary')
const User = require('../models/User')

exports.fetchAllFromUser = async (req, res) => {
    // fetch all from user in chronological order
    let summaries = []
    try {
        summaries = await Summary.find({ user: req.userId }).sort({ dateCreated: 1 })

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
        const summaryId = req.summaryId
        const summary = await Summary.findById(summaryId)
        res.status(200).json(summary)
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while getting summary: ' + e.message })
    }
}

exports.findSummaryFromText = async (req, res) => {
    let searchText = ''
    try {
        searchText = req.query('searchText').toString()
    }
    catch (e) {
        console.error('searchText parameter is not formatted properly')
        res.status(400).json({ error: 'searchText parameter is not formatted properly' })
    }

    let matchingSummaries = []
    try {
        matchingSummaries = await Summary.find({ user: req.userId, title: { $regex: searchText, $options: 'i' } })
    }
    catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while searching users summaries: ' + e.message })
    }

    res.status(200).json({ summaries: matchingSummaries })
}

exports.updateSummaryTitle = async (req, res) => {
    try {
        const summaryId = req.summaryId
        const newTitle = req.body.title
        await Summary.findByIdAndUpdate(summaryId, { title: newTitle }, (err, updatedSummary) => {
            if (!updatedSummary) { res.status(404).json({ error: 'Summary not found' }) }
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while updating summary title: ' + e.message })
    }
}

exports.deleteSummary = async (req, res) => {
    try {
        const summaryId = req.params.summaryId
        await Summary.findByIdAndRemove(summaryId, (err, deletedSummary) => {
            if (!deletedSummary) { res.status(404).json({ error: 'Summary not found' }) }
        })
        res.status(200).json({ message: 'Successfully deleted summary' })
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ error: 'The following error occurred while deleting summary: ' + e.message })
    }
}

exports.createSummary = async (req, res) => {
    const { title, summary, options } = req.body
    const userId = req.userId

    let user = null
    try {
        user = await User.findById(userId)
    } catch (e) {
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

exports.generateSummary = async (req, res) => {
    // get the userId and lookup corresponding openai key
    // return an error message / response if they don't have a key
    // key won't be invalid because we check for that before saving it to the user

    // get the options from the request body (pass them as key value pairs?)

    // TODO
    // implement logic here (or add a function from the utils folder)
    // to get the prompt to use based on the user's selected options

    res.status(200).json({ message: 'generateSummary endpoint not implemented yet' })
}