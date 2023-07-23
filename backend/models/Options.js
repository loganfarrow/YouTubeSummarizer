const mongoose = require('mongoose')


/*
    Schmema for Option Objects
    Options object represents the settings the user has picked to generate a summary (values of options decide the prompts used)

*/

const optionsSchema = new mongoose.Schema({
    length: {
        type: String,
        enum: ['tiny', 'short', 'medium', 'long', 'xlong'],
        required: true,
        default: 'medium'
    },
    tone: {
        type: String,
        enum: ['standard', 'professional', 'academic', 'casual', 'einstein', 'redneck', 'dog'],
        required: true,
        default: 'standard'
    },
    targetAge: {
        type: String,
        enum: ['unspecified', 'five year old', 'teenager', 'college student', 'adult'],
        required: true,
        default: 'unspecified'
    },
    bulletPoints: {
        type: Boolean,
        required: true,
        default: false
    },
    paragraphLimit: Number,
    wordLimit: Number,
    bulletPointLimit: Number,
})

// take in a json object and creates an Options instance out of it
optionsSchema.statics.createNewOptions = async function (options) {

    const { length, tone, targetAge, bulletPoints, paragraphLimit, wordLimit, bulletPointLimit } = options
    return new this({
        length: length || 'medium',
        tone: tone || 'standard',
        targetAge: targetAge || 'unspecified',
        bulletPoints: bulletPoints || false,
        paragraphLimit: paragraphLimit,
        bulletPointLimit: bulletPointLimit,
    })
}

let optionsModel = mongoose.model('Options', optionsSchema)

module.exports = optionsModel