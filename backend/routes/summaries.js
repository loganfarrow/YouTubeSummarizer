require('dotenv').config()
const express = require('express')
// const { check, validationResult } = require('express-validator');

const router = express.Router()

// fetch all summaries from user (in chronological order with option to reverse order)
router.get('/:userId(\\d+)', (req, res) => {
    if ('reverse' in req.query) {
        if (req.query.reverse === 'true') {
            // TODO fetch summaries in reverse order
        }
    }
    else {
        // TODO fetch summaries in chronological order        
    }

    res.status(200).json({ message: 'hello world' })
})

// fetch specific summary from user
router.get('/:userId(\\d+)/fetchSummary/:summaryId(\\d+)', (req, res) => {
    res.status(200).json({ message: 'hello world' })
})

// fetch only summaries with given search text in title
router.get('/:userId(\\d+)/findSummary', (req, res) => {
    let searchText = req.query('searchText').toString()
    if (!searchText.isString()) {
        res.status(400).json({ error: 'The summary search query must be a string' })
    }
    res.status(200).json({ message: 'hello world' })
})

// update specific summary title
router.patch('/:userId(\\d+)/getSummaryTitle/:summaryId(\\d+)', (req, res) => {
    res.status(200).json({ message: 'hello world' })
})

// delete specific summary
router.delete('/:userId(\\d+)/deleteSummary/:summaryId(\\d+)', (req, res) => {
    res.status(200).json({ message: 'hello world' })
})

// create new summary
router.post('/:userId(\\d+)/createSummary', (req, res) => {
    // const {name, summary, etc} = req.body

    res.status(200).json({ message: 'hello world' })
})


module.exports = router