const { sendResponse } = require('../../../utils/responseHandler')
const { validationInput } = require('../../../utils/utils')
const Customer = require('../CustomerRegister/db')
const Bill = require('./db')

const createBilling = async (req, res) => {
    try {
        const { phone } = req.query
        const { amountPaid, paymentMethod, image, items } = req.body

        if (!items || items.length === 0) {
            return sendResponse(res, 400, false, "Cart cannot be empty")
        }

        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return sendResponse(res, 404, false, "Customer not found register user");
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
            return sendResponse(res, 401, false, 'Amount paid cannot exceed grand total')
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
        return sendResponse(res, 201, true, 'Bill Generate SuccessFully', { Bill: createBill })



    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, "Internal Server Error")
    }
}

const updateBilling = async (req, res) => {
    try {
        const { phone, bill_id } = req.query
        const { amountPaid, paymentMethod, image, items } = req.body

        if (!items || items.length === 0) {
            return sendResponse(res, 400, false, "Cart cannot be empty")
        }

        const existingUser = await Customer.findOne({ phone })
        if (!existingUser) {
            return sendResponse(res, 404, false, "Customer not found register user");
        }

        const existingBills = await Bill.findById({ _id: bill_id })
        if (!existingBills) {
            return sendResponse(res, 400, false, "Bill not exist")
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
            return sendResponse(res, 401, false, 'Amount paid cannot exceed grand total')
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
        return sendResponse(res, 200, true, 'Bill Generate SuccessFully', { Bill: updateBill })
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, 'Internal Server Error')
    }

}

const recordBillPayment = async (req, res) => {
    try {
        const { bill_id } = req.query
        const { additionalPayment, paymentMethod } = req.body

        if (!bill_id) return sendResponse(res, 400, false, 'bill_id is required')

        const existingBill = await Bill.findById(bill_id).lean()
        if (!existingBill) return sendResponse(res, 404, false, 'Bill not found')

        const grandTotal = existingBill.invoice.finalPrice || existingBill.invoice.grandTotal
        const newTotalPaid = existingBill.payment.amountPaid + (Number(additionalPayment) || 0)

        if (newTotalPaid > grandTotal) {
            return sendResponse(res, 400, false, 'Payment exceeds grand total of bill')
        }

        const remainingAmount = grandTotal - newTotalPaid
        let paymentStatus = 'unpaid'
        if (newTotalPaid <= 0) paymentStatus = 'unpaid'
        else if (newTotalPaid < grandTotal) paymentStatus = 'partially_paid'
        else paymentStatus = 'paid'

        const updated = await Bill.findByIdAndUpdate(
            bill_id,
            {
                'payment.amountPaid': newTotalPaid,
                'payment.remainingAmount': remainingAmount,
                'payment.paymentStatus': paymentStatus,
                ...(paymentMethod ? { 'payment.paymentMethod': paymentMethod } : {})
            },
            { new: true }
        ).populate('customerId', 'name phone')

        return sendResponse(res, 200, true, 'Payment recorded successfully', { Bill: updated })
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, 'Internal Server Error')
    }
}

const getBillingProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const { phone } = req.query

        if (phone) {
            const existingUser = await Customer.findOne({ phone })
            if (!existingUser) {
                return sendResponse(res, 404, false, "Customer not found register user");
            }
            const bills = await Bill.find({ customerId: existingUser._id }).populate("customerId", "name phone").sort({ createdAt: -1 })

            return sendResponse(res, 200, true, 'Customer profile fetched successfully', {
                customer: existingUser,
                data: bills
            })
        } else {
            // Find all customers belonging to this shopkeeper
            const shopkeeperCustomers = await Customer.find({ shopkeeperId: req.user.id }).select("_id")
            const customerIds = shopkeeperCustomers.map(c => c._id)


            const allBills = await Bill.find({ customerId: { $in: customerIds } }).populate("customerId", "name phone").sort({ createdAt: -1 })

            return sendResponse(res, 200, true, 'All bills fetched successfully', {
                data: allBills
            })
        }
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, "Internal Server Error")

    }
}

module.exports = { createBilling, getBillingProfile, updateBilling, recordBillPayment }






