const mongoose = require('mongoose')
const { type } = require('os')
const Schema = mongoose.Schema


//Schemas define structure of our model/Databse 
const SongSchema = new Schema({
    songname: {
        type: String,
        required: true
    },
    songcategory: {
        type: String,
        required: true
    },
    songduration: {
        type: String,
        required: true
    },
    songartist: {
        type: String,
        required: true
    }
}, { timestamps: true })

const SongCollection = mongoose.model('Songs', SongSchema)
module.exports = SongCollection