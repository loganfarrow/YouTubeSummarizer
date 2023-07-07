const mongoose = require('mongoose')

/*
    Schmema for Summary Objects
        title
        summary
        options: map of user-selectable options (for example, bullet_points = true, n_bullet_points = 5, academic_tone = true, explanation_age = 5, length = "short", and other options that affect summary prompt)

*/

const summarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    options: {
        type: Map,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})