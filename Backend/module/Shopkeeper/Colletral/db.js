const mongoose = require('mongoose')

const colletralSchema = new mongoose.Schema(

  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    jewellery: {
      type: String,
      required: true
    },
    image: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    status: {
       type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model('Collateral', colletralSchema)
