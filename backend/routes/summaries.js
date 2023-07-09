require('dotenv').config()
const express = require('express')
const summaryController = require('../controllers/summaryController')
// const { check, validationResult } = require('express-validator');

const router = express.Router()

// fetch all summaries from user (in chronological order with option to reverse order)
router.get('/:userId(\\d+)', summaryController.fetchAllFromUser)

// fetch specific summary from user
router.get('/:userId(\\d+)/fetchSummary/:summaryId(\\d+)', summaryController.fetchOneFromUser)

// fetch only summaries with given search text in title
router.get('/:userId(\\d+)/findSummary', (req, res) => summaryController.findSummaryFromText)

// update specific summary title
router.patch('/:userId(\\d+)/getSummaryTitle/:summaryId(\\d+)', summaryController.updateSummaryTitle)

// delete specific summary
router.delete('/:userId(\\d+)/deleteSummary/:summaryId(\\d+)', summaryController.deleteSummary)

// create new summary
router.post('/:userId(\\d+)/createSummary', summaryController.createSummary)


module.exports = router