const { min } = require('lodash')
const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 6,
    },
    gender: {
        type: String,
        required: true
    },
    address: {
            type: String,
            required: true
    },
    "emergency contact": {
        type: String,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
})


const StudentModel = mongoose.model('Student', studentSchema)

module.exports = StudentModel
