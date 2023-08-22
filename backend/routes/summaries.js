require('dotenv').config()
const express = require('express')
const summaryController = require('../controllers/summaryController')
const requireAuth = require('../middleware/requireAuth')

// const { check, validationResult } = require('express-validator');

const router = express.Router()

// apply requireAuth middleware to routes that require authentication
// TODO: 
// will need to remove some of these if we implement a public summary feature that 
// doesn't require authentication, also if we implement a friends 
// feature / anything that allows you to see other people's summaries
const routesNeedingAuth = [
    '/fetchSummaries',
    '/fetchSummary',
    '/findSummary',
    '/updateSummaryTitle',
    '/deleteSummary',
    '/createSummary',
    '/generateSummary'
]

router.use(routesNeedingAuth, requireAuth)

// fetch 7 summaries from user (in chronological order with option to reverse order)
router.get('/fetchSummaries', summaryController.fetchAllFromUser)

// fetch specific summary from user
router.get('/fetchSummary', summaryController.fetchSummary)

// fetch only summaries with given search text in title associated with user (search text is a url query param)
router.get('/findSummary', summaryController.findSummaryFromTitle)

// update summary fields (title, summary text, options)
router.patch('/updateSummary', summaryController.updateSummary)

// delete specific summary
router.delete('/deleteSummary', summaryController.deleteSummary)

// takes user's choices for summary options and makes call to openai to generate summary
router.post('/generateSummary', summaryController.generateSummary)

module.exports = router