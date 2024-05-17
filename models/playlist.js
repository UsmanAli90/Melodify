const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Playlist schema
const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'songs'
    }]
}, { timestamps: true });

const PlaylistCollection = mongoose.model('Playlist', PlaylistSchema);
module.exports = PlaylistCollection;
