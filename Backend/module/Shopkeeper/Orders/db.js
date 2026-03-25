const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    description: { type: String, default: '' },
    metal: { type: String, enum: ['gold', 'silver', 'diamond', 'platinum', 'other'], required: true },
    purity: { type: String, default: '' },
    weight: { type: Number, min: 0, default: 0 },
    size: { type: String, default: '' },
}, { _id: false })

const orderSchema = new mongoose.Schema(
    {
        shopkeeperId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        // Array of jewelry items ordered
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (v) { return v.length > 0 },
                message: 'Order must have at least one item'
            }
        },
        // Reference images of jewelry customer wants made
        image: {
            type: [String],
            required: true,
            validate: {
                validator: function (v) { return v.length > 0 },
                message: 'At least one image is required for an order'
            }
        },
        // Estimated total price for the entire order
        Total: {
            type: Number,
            required: true,
            min: 0
        },
        // Advance payment received upfront
        AdvancePayment: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        // Calculated: Total - AdvancePayment
        RemainingAmount: {
            type: Number,
            required: true,
            default: 0
        },
        // Payment status based on amounts
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'partially_paid', 'paid'],
            default: 'unpaid'
        },
        // Order progress/production status
        orderStatus: {
            type: String,
            enum: ['request', 'accept', 'progress', 'complete'],
            default: 'request'
        },
        // Notes / remarks from shopkeeper
        notes: {
            type: String,
            default: ''
        },
        // Expected delivery date
        deliveryDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order', orderSchema)