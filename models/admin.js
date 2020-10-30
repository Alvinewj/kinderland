const { min } = require('lodash')
const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: [{
        nested: {
            first_name: {
                type: String,
                required: true
            },
            family_name: {
                type: String,
                required: true
            }
        },
    }],
    Class_in_Charge: {
        type: String,
    },
    

})


const AdminModel = mongoose.model('Admin', adminSchema)

module.exports = AdminModel

