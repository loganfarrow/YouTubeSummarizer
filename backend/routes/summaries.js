require('dotenv').config()
const express = require('express')
const summaryController = require('../controllers/summaryController')
// const { check, validationResult } = require('express-validator');

const router = express.Router()

// fetch all summaries from user (in chronological order with option to reverse order)
router.get('/:userId(\\d+)', summaryController.fetchAllFromUser)

// fetch specific summary
router.get('/fetchSummary/:summaryId(\\d+)', summaryController.fetchSummary)

// fetch only summaries with given search text in title associated with user (search text is a url query param)
router.get('/:userId(\\d+)/findSummary', summaryController.findSummaryFromText)

// update specific summary title
router.patch('/updateSummaryTitle/:summaryId(\\d+)', summaryController.updateSummaryTitle)

// delete specific summary
router.delete('/deleteSummary/:summaryId(\\d+)', summaryController.deleteSummary)

// create new summary associated with user
router.post('/:userId(\\d+)/createSummary', summaryController.createSummary)


module.exports = router