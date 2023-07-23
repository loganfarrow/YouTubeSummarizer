// includes environment variables
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const authenticationRoutes = require('./routes/authentication')
const summaryRoutes = require('./routes/summaries')

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

// if no routes match, return 404 and remind them to only use integer paramters for userId and summaryId
app.use((req, res) => {
    return res.status(404).json({ error: 'Route not found' });
});

// check for errors
app.use((err, req, res, next) => {
    return res.status(500).json({ error: 'Internal Server Error: ' + err });
});

// listen for request to backend
app.listen(process.env.PORT, () => {
    console.log(`api is running on port ${process.env.PORT}`)
})
