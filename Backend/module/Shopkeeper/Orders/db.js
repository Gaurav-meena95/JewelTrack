const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,

        },
        jewellery: {
            type: String,
            required: true
        },
        image: {
            type: [String],
            default: []
        },
        AdvancePayment: {
            type: String,
            required: true
        },
        Total: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['request', 'accept','progress','compelete'],
            default: 'active'
        },
        size:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order',orderSchema)