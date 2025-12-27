const mongoose = require('mongoose')

const billingSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        invoice: {
            itemName: String,
            metal: { type: String, enum: ['gold', 'silver', 'diamond'] },
            purity: String,
            weight: Number,
            ratePerGram: Number,
            makingChargePercent: Number,
            gstPercent: {
                type: Number,
                default: 3
            },
            manualAdjustment: {
                type: Number,
                default: 0
            },
            finalPrice: Number
        }

    }
)


module.exports = mongoose.model('Bill', billingSchema)

