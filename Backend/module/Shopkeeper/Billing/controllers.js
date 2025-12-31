const Customer = require('../CustomerRegister/db')
const Bill = require('./db')

const createBilling = async (req, res) => {
    try {
        const { phone } = req.query
        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return res.status(404).json({ message: "Customer not found register user" });
        }
        const { itemName, metal, purity, weight, ratePerGram, makingChargePercent, gstPercent, manualAdjustment } = req.body.invoice[0]
        const basePrice = (weight * ratePerGram)
        const finalPrice = basePrice + (basePrice * (makingChargePercent) / 100) + (basePrice * (gstPercent) / 100) - manualAdjustment
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