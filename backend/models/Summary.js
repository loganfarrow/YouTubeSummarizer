const mongoose = require('mongoose')

/*
    Schmema for Summary Objects

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Options',
    },
    user: {    // this is really the users id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
{
    timestamps: true  // automatically adds createdAt and updatedAt fields (they are Date objects)
})

// delete the options object associated with a summary if the summary is deleted
summarySchema.pre('remove', async function (next) {
    try {
        const summary = this
        await summary.model('Options').findByIdAndRemove(summary.options._id)
    } catch (e) {
        throw new Error('The following error occurred while deleting options object associated with summary being deleted: ' + e.message)
    }
    next()
})

// define how it is serialized
// toJSON takes an obtions object which takes a transform method if we want to pass on
// transform method is called on toJSON's output before it is returned
// summarySchema.set('toJSON', {
//     transform: (originalObject, returnedObject) => {
//         returnedObject.user = returnedObject.user._id
//     }
// })

let summaryModel = mongoose.model('Summary', summarySchema)

module.exports = summaryModel