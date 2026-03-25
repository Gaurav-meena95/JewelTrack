const { validationInput } = require('../../../utils/utils')
const Customer = require('../CustomerRegister/db')
const Bill = require('./db')

const createBilling = async (req, res) => {
    try {
        const { phone } = req.query
        const { amountPaid, paymentMethod, image, items } = req.body
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart cannot be empty" })
        }

        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return res.status(404).json({ message: "Customer not found register user" });
        }

        let grandTotal = 0;
        const processedItems = items.map(item => {
            const basePrice = (Number(item.weight) * Number(item.ratePerGram))
            const finalPrice = basePrice + (basePrice * (Number(item.makingChargePercent) || 0) / 100) + (basePrice * (Number(item.gstPercent) || 0) / 100) - (Number(item.manualAdjustment) || 0)
            grandTotal += finalPrice;
            return {
                ...item,
                finalPrice
            }
        });

        if (amountPaid > grandTotal) {
            return res.status(401).json({ message: 'Amount paid cannot exceed grand total' })
        }
        
        let paymentStatus = 'unpaid'
        let remainingAmount = grandTotal
        if (amountPaid === 0) {
            paymentStatus = 'unpaid'
            remainingAmount = grandTotal
        } else if (amountPaid < grandTotal) {
            paymentStatus = 'partially_paid'
            remainingAmount = grandTotal - amountPaid
        } else {
            paymentStatus = 'paid'
            remainingAmount = 0
        }
        
        const createBill = await Bill.create({
            customerId: existingUser._id,
            image: image || [],
            invoice: {
                items: processedItems,
                grandTotal
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

const updateBilling = async (req, res) => {
    try {
        const { phone, bill_id } = req.query
        const { amountPaid, paymentMethod, image, items } = req.body
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart cannot be empty" })
        }

        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return res.status(404).json({ message: "Customer not found register user" });
        }
        
        const existingBills = await Bill.findById({_id:bill_id })
        if (!existingBills) {
            return res.status(400).json({ message: "Bill not exist" })
        }

        let grandTotal = 0;
        const processedItems = items.map(item => {
            const basePrice = (Number(item.weight) * Number(item.ratePerGram))
            const finalPrice = basePrice + (basePrice * (Number(item.makingChargePercent) || 0) / 100) + (basePrice * (Number(item.gstPercent) || 0) / 100) - (Number(item.manualAdjustment) || 0)
            grandTotal += finalPrice;
            return {
                ...item,
                finalPrice
            }
        });

        if (amountPaid > grandTotal) {
            return res.status(401).json({ message: 'Amount paid cannot exceed grand total' })
        }
        
        let paymentStatus = 'unpaid'
        let remainingAmount = grandTotal
        if (amountPaid === 0) {
            paymentStatus = 'unpaid'
            remainingAmount = grandTotal
        } else if (amountPaid < grandTotal) {
            paymentStatus = 'partially_paid'
            remainingAmount = grandTotal - amountPaid
        } else {
            paymentStatus = 'paid'
            remainingAmount = 0
        }

        const updateBill = await Bill.updateOne(
            { _id: existingBills._id },
            {
                image: image || [],
                invoice: {
                    items: processedItems,
                    grandTotal
                },
                payment: {
                    amountPaid,
                    remainingAmount,
                    paymentStatus,
                    paymentMethod
                }
            }
        )
        console.log('Bill Generate SuccessFully', updateBill)
        return res.status(200).json({
            message: 'Bill Generate SuccessFully',
            Bill: updateBill
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}
const getBillingProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const { phone } = req.query
        
        if (phone) {
            const existingUser = await Customer.findOne({ phone })
            if (!existingUser) {
                return res.status(404).json({ message: "Customer not found register user" });
            }
            const bills = await Bill.find({ customerId: existingUser._id }).populate("customerId", "name phone").sort({ createdAt: -1 })

            return res.status(200).json({
                message: 'Customer profile fetched successfully',
                customer: existingUser,
                data: bills
            })
        } else {
            // Find all customers belonging to this shopkeeper
            const shopkeeperCustomers = await Customer.find({ shopkeeperId: req.user.id }).select("_id")
            const customerIds = shopkeeperCustomers.map(c => c._id)
            
            // Find all bills for these customers
            const allBills = await Bill.find({ customerId: { $in: customerIds } }).populate("customerId", "name phone").sort({ createdAt: -1 })
            
            return res.status(200).json({
                message: 'All bills fetched successfully',
                data: allBills
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })

    }
}

module.exports = { createBilling, getBillingProfile, updateBilling }






