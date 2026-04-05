const { sendResponse } = require('../../../utils/responseHandler')
const Order = require('../Orders/db')
const Customer = require('../CustomerRegister/db')

// Helper: compute payment status
const computePaymentStatus = (total, advancePaid) => {
    if (advancePaid <= 0) return 'unpaid'
    if (advancePaid >= total) return 'paid'
    return 'partially_paid'
}


const createOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const shopkeeper_id = req.user.id
        const { phone } = req.query
        const { items, image, AdvancePayment, Total, orderStatus, notes, deliveryDate } = req.body

        if (!phone) return sendResponse(res, 400, false, 'Customer phone is required')
        if (!items || items.length === 0) return sendResponse(res, 400, false, 'Order must have at least one item')
        if (!image || image.length === 0) return sendResponse(res, 400, false, 'At least one image is required for the order')
        if (Total === undefined || Total === null) return sendResponse(res, 400, false, 'Total estimated price is required')

        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return sendResponse(res, 404, false, 'Customer not found. Please register the customer first.')
        }

        const advance = Number(AdvancePayment) || 0
        const total = Number(Total)
        if (advance > total) {
            return res.status(400).json({ message: 'Advance payment cannot exceed total amount' })
        }

        const RemainingAmount = total - advance
        const paymentStatus = computePaymentStatus(total, advance)

        const newOrder = await Order.create({
            shopkeeperId: shopkeeper_id,
            customerId: existing._id,
            items,
            image,
            AdvancePayment: advance,
            Total: total,
            RemainingAmount,
            paymentStatus,
            orderStatus: orderStatus || 'request',
            notes: notes || '',
            deliveryDate: deliveryDate || null
        })

        const populated = await Order.findById(newOrder._id).populate('customerId', 'name phone address')
        return sendResponse(res, 201, true, 'Order created successfully', { order: populated })

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}


const allOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }

        // Find all customers belonging to this shopkeeper
        const shopkeeperCustomers = await Customer.find({ shopkeeperId: req.user.id }).select('_id')
        const customerIds = shopkeeperCustomers.map(c => c._id)

        const orders = await Order.find({ customerId: { $in: customerIds } })
            .populate('customerId', 'name phone address')
            .sort({ updatedAt: -1 })

        return sendResponse(res, 200, true, 'Orders fetched successfully', { data: orders })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}


const updateOrders = async (req, res) => {
    try {
        const { order_id } = req.query
        const { items, image, AdvancePayment, Total, orderStatus, paymentHistory, notes, deliveryDate ,amount} = req.body
        console.log(req.body)
        if (!order_id) return sendResponse(res, 400, false, 'order_id is required')

        const existingOrder = await Order.findById(order_id)
        if (!existingOrder) return sendResponse(res, 404, false, 'Order not found')

        const advance = Number(AdvancePayment) ?? existingOrder.AdvancePayment
        const total = Number(Total) ?? existingOrder.Total
        if (advance > total) {
            return sendResponse(res, 400, false, 'Advance payment cannot exceed total amount')
        }
    
        const RemainingAmount = total - advance - amount
        const paymentStatus = computePaymentStatus(total, advance)
        console.log('fgerf',RemainingAmount)

        const updated = await Order.findByIdAndUpdate(
            order_id,
            {items, image, AdvancePayment, Total, orderStatus, paymentHistory, notes, deliveryDate,RemainingAmount,paymentStatus},
            { new: true }
        ).populate('customerId', 'name phone address')

        return sendResponse(res, 200, true, 'Order updated successfully', { order: updated })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}


const deleteOrders = async (req, res) => {
    try {
        const { order_id } = req.query
        if (!order_id) return sendResponse(res, 400, false, 'order_id is required')

        const existing = await Order.findById(order_id)
        if (!existing) return sendResponse(res, 404, false, 'Order not found')

        await Order.deleteOne({ _id: order_id })
        return sendResponse(res, 200, true, 'Order deleted successfully')
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}

module.exports = { createOrders, updateOrders, deleteOrders, allOrders }
