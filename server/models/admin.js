const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
        required: true,
        immutable: true,
    }
})

module.exports = mongoose.model("Admin", adminSchema)