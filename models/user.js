const mongoose = require('mongoose')
const { type } = require('os')
const Schema = mongoose.Schema


//Schemas define structure of our model/Databse 
const SignupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Collection = mongoose.model('User', SignupSchema)
module.exports = Collection