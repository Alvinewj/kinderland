const { min } = require('lodash')
const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    address: [{
        addr_line_1: {
            type: String,
            required: true
        },
        addr_line_2: {
            type: String,
        },
        unit: {
            type: String,
        },
        postal_code: {
            type: String,
            required: true
        },
    }],
})


const UsersModel = mongoose.model('Users', usersSchema)

module.exports = UsersModel

