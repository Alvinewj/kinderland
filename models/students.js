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
    address: [{
        addr_line_1: {
            type: String,
            required: true,
        },
        addr_line_2: {
            type: String,
        },
        unit: {
            type: String,
        },
        postal_code: {
            type: String,
            required: true,
        },
    }],
    emergency_contact: {
        Name: String,
        Contact: Number,
        Relationship: String,
        required: true
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
