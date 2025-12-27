const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: String,
    father_name: String,
    phone: { type: String, unique: true },
    email: String,
    address: String
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema)
