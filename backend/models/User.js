const mongoose = require('mongoose')
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const bcrypt = require('bcrypt')
const validator = require('validator')
const errorMessages = require('../utils/error_messages')

/*
    Schmema for User Objects
        
*/
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        // match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    openai_key: {
        type: String,
        required: false,
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

// this encryption will introduce another field, __enc_openai_key which is true if the openai_key is encrypted
userSchema.plugin(mongooseFieldEncryption, {
    fields: ["openai_key"],
    secret: process.env.ENCRYPTION_SECRET,
})

userSchema.statics.register = async function (email, password) {
    if (!email || !password) {
        throw new Error(errorMessages.provideEmailAndPasswordToRegister)
    }

    if (!validator.isEmail(email)) {
        throw new Error(errorMessages.provideValidEmailToRegister)
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error(errorMessages.provideStrongPasswordToRegister)
    }

    const exists = await this.findOne({ email: email })
    if (exists) {
        throw new Error(errorMessages.userAlreadyExists)
    }

    // salt: random string added to password before hashing to make it more secure
    //       prevents hackers from password matching if they crack one password
    const salt = await bcrypt.genSalt(10)
    const hashed_password = await bcrypt.hash(password, salt)

    const user = new this({
        email: email,
        hashed_password: hashed_password,
    })

    await user.save()

    return user
}

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email })
    if (!user) {
        throw new Error(errorMessages.userDoesNotExistForEmail)
    }

    const match = await bcrypt.compare(password, user.hashed_password)
    if (!match) {
        throw new Error(errorMessages.incorrectPassword)
    }

    return user
}


// for non-static method, this refers to the instance of the user, not the User class
userSchema.methods.updatePassword = async function (newPassword) {
    // proposed new password must be strong
    if (!validator.isStrongPassword(newPassword)) {
        throw new Error(errorMessages.provideStrongPasswordToRegister)
    }

    // return error if current password is the same as the new password
    const curPassword = this.hashed_password
    if (bcrypt.compare(curPassword, newPassword)) {
        throw new Error('new password must be different than the current password')
    }

    // salt: random string added to password before hashing to make it more secure
    const salt = await bcrypt.genSalt(10)
    const hashed_new_password = await bcrypt.hash(newPassword, salt)

    this.hashed_password = hashed_new_password
    await this.save()
    return this
}

userSchema.methods.updateEmail = async function (newEmail) {
    // proposed new email must be valid
    if (!validator.isEmail(newEmail)) {
        throw new Error(errorMessages.provideValidEmailToRegister)
    }

    // return error if current email is the same as the new email
    const curEmail = this.email
    if (curEmail === newEmail) {
        throw new Error('new email must be different than the current email')
    }

    this.email = newEmail
    await this.save()
    return this
}

let userModel = mongoose.model('User', userSchema)

module.exports = userModel