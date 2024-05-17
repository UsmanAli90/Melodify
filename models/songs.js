const mongoose = require('mongoose')
const { type } = require('os')
const Schema = mongoose.Schema


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
    },
    songpath: {
        type: mongoose.Schema.Types.ObjectId, // Reference to GridFS file
        required: true
    }
}, { timestamps: true });

const SongCollection = mongoose.model('Songs', SongSchema);
module.exports = SongCollection;