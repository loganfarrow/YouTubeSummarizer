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
    const acceptableOptions = ['length', 'tone', 'targetAge', 'bulletPoints', 'paragraphLimit', 'wordLimit', 'bulletPointLimit']
    
    // ensure that all the options provided are valid
    for (const key in options) {
        if (!acceptableOptions.includes(key)) {
            throw new Error('invalid option provided in options dictionary: ' + key)
        }
    }

    const { length, tone, targetAge, bulletPoints, paragraphLimit, wordLimit, bulletPointLimit } = options

    // ensure field values are valid
    if ((length && !['tiny', 'short', 'medium', 'long', 'xlong'].includes(length))) {
        throw new Error('invalid length value provided in options dictionary: ' + length)
    }
    if (tone && !['standard', 'professional', 'academic', 'casual', 'einstein', 'redneck', 'dog'].includes(tone)) {
        throw new Error('invalid tone value provided in options dictionary: ' + tone)
    }
    if (targetAge && !['unspecified', 'five year old', 'teenager', 'college student', 'adult'].includes(targetAge)) {
        throw new Error('invalid targetAge value provided in options dictionary: ' + targetAge)
    }
    if (bulletPoints && typeof bulletPoints !== 'boolean') {
        throw new Error('bulletPoints value must be a boolean')
    }
    if ((paragraphLimit && typeof paragraphLimit !== 'number') || typeof paragraphLimit === 'boolean') {
        throw new Error('paragraphLimit value must be a number')
    }
    if ((wordLimit && typeof wordLimit !== 'number') || typeof wordLimit === 'boolean') {
        throw new Error('wordLimit value must be a number')
    }
    if ((bulletPointLimit && typeof bulletPointLimit !== 'number') || typeof bulletPointLimit === 'boolean') {
        throw new Error('bulletPointLimit value must be a number')
    }

    return new this({
        length: length || 'medium',
        tone: tone || 'standard',
        targetAge: targetAge || 'unspecified',
        bulletPoints: bulletPoints || false,
        wordLimit: wordLimit || 300,
        paragraphLimit: paragraphLimit,
        bulletPointLimit: bulletPointLimit,
    })
}

let optionsModel = mongoose.model('Options', optionsSchema)

module.exports = optionsModel