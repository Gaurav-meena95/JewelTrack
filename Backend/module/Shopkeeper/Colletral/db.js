const mongoose = require('mongoose')

const colletralSchema = new mongoose.Schema(
    {
    name: String,
    father_name: String,
    phone: { type: String, unique: true },
    email: String,
    address: String,
    
}, { timestamps: true }
)