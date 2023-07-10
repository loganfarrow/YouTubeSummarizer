const mongoose = require('mongoose')

/*
    Schmema for User Objects
        
*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    hashed_openai_key: {
        type: String,
        required: false,
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now,
    }
})