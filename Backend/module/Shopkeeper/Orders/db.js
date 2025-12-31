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
            type: Number,
            required: true,
            min:0
        },
        Total: {
            type: Number,
            required: true,
            min:0
        },
        status: {
            type: String,
            enum: ['request', 'accept', 'progress', 'complete'],
            default: 'request'
        },
        size:{
            type: String,
            required: true
        },
        RemaningAmount:{
            type:Number,
            required:true,
            default:0
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order',orderSchema)