const { validationInput } = require('../../../utils/utils')
const Customer = require('../CustomerRegister/db')
const Bill = require('./db')

const createBilling = async (req, res) => {
    try {
        const { phone } = req.query
        const { itemName, metal, purity, weight, ratePerGram, makingChargePercent, gstPercent, manualAdjustment,amountPaid ,paymentMethod} = req.body
        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return res.status(404).json({ message: "Customer not found register user" });
        }

        const value = validationInput({amountPaid, itemName, metal, purity, weight, ratePerGram, makingChargePercent, gstPercent, manualAdjustment})
        if (value){
            return res.status(401).json({message: `Check missing value ${value}`})
        }

        const basePrice = (weight * ratePerGram)
        const finalPrice = basePrice + (basePrice * (makingChargePercent) / 100) + (basePrice * (gstPercent) / 100) - manualAdjustment
        console.log(finalPrice)
        if (amountPaid > finalPrice) {
            return res.status(401).json({ message: 'Amount paid cannot exceed final price' })
        }
        if (amountPaid === 0) {
            paymentStatus = 'unpaid'
            remainingAmount = finalPrice
        } else if (amountPaid < finalPrice) {
            paymentStatus = 'partially_paid'
            remainingAmount = finalPrice - amountPaid
        } else {
            paymentStatus = 'paid'
            remainingAmount = 0
        }
        const createBill = await Bill.create({
            customerId: existingUser._id,
            invoice: {
                itemName,
                metal,
                purity,
                weight,
                ratePerGram,
                makingChargePercent,
                gstPercent,
                manualAdjustment,
                finalPrice
            },
            payment: {
                amountPaid,
                remainingAmount,
                paymentStatus,
                paymentMethod
            }
        })
        console.log('Bill Generate SuccessFully', createBill)
        return res.status(201).json({
            message: 'Bill Generate SuccessFully',
            Bill: createBill
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
const getBillingProfile = async (req, res) => {
    try {
        const { phone } = req.query
        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return res.status(404).json({ message: "Customer not found register user" });
        }
        const bills = await Bill.find({ customerId: existingUser._id })

        return res.status(200).json({
            message: 'Customer profile fetched successfully',
            customer: existingUser,
            bills
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })

    }
}

module.exports = { createBilling, getBillingProfile }