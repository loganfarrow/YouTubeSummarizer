const mongoose = require('mongoose')

/*
    Schmema for User Objects
        
*/
const userSchema = new mongoose.Schema({
    username: String,
})