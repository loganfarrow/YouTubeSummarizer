// includes environment variables
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const authenticationRoutes = require('./routes/authentication')
const summaryRoutes = require('./routes/summaries')
const userRoutes = require('./routes/users')

const app = express()

// connect to AtlasDB
mongoose.connect(process.env.MONG_URI, {
    useNewUrlParser: true, // TODO are these two params needed?
    useUnifiedTopology: true
})
    .then(() => {
        console.log('connected to mongodb atlas')
    })
    .catch((error) => {
        console.log('error connecting to mongodb atlas: ', error)
    })

// define middleware here (middleware is called on requests in the order it's defined)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// debugging middleware to print out any request and method that comes in
app.use((req, res, next) => {
    console.log(req.method, ' request to ', req.path, ' with body ', req.body)
    next()
})

// point to the route files (which contain the endpoints)
app.use('/authentication', authenticationRoutes)
app.use('/api/summaries', summaryRoutes)
app.use('/api/users', userRoutes)

// if no routes match, return 404 and remind them to only use integer paramters for userId and summaryId
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found, make sure you are passing in integer paramters for userId and summaryId in the url' });
});

// check for and log errors
app.use((err, req, res, next) => {
    console.error('ERROR: ', err); // Log the error for debugging purposes

    res.status(500).json({ error: 'Internal Server Error' });
});

// listen for request to backend
app.listen(process.env.PORT, () => {
    console.log(`api is running on port ${process.env.PORT}`)
})


// endpoints to make
// 1. fetch all summaries for given user      GET     /api/summaries/:userId
    // should return in chronological order (maybe include query argument to display in reverse order)
// 2. fetch specific summary from user's summaries  GET /api/summaries/:userId/:summaryId
// 2 1/2. fetch only summaries with given search text in title  GET /api/summaries/:userId/findSummary?searchText=...
// 3. update specific summary title  PATCH /api/summaries/:userId/:summaryId
// 4. delete specific summary  DELETE /api/summaries/:userId/:summaryId
// 5. create new summary  POST /api/summaries/:userId
//
// TODO these will probably need to be modified
// 6. create new user POST /api/users
// 7. delete user DELETE /api/users/:userId
// 8. update user data PATCH /api/users/:userId
// 9. fetch user data GET /api/users/:userId  
//
// TODO figure these out
// 10. log in user POST /api/login    [create the session]
// 11. log out user GET /api/logout    [end the session]