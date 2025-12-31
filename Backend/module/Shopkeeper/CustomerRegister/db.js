const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    father_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        maxLength:10
    },
    email: {
        type: String,
        required: true
    },
    address: String
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema)
