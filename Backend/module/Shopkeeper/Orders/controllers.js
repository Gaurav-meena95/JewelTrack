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
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const shopkeeper_id = req.user.id
        const { phone } = req.query
        const { items, image, AdvancePayment, Total, orderStatus, notes, deliveryDate } = req.body

        if (!phone) return res.status(400).json({ message: 'Customer phone is required' })
        if (!items || items.length === 0) return res.status(400).json({ message: 'Order must have at least one item' })
        if (!image || image.length === 0) return res.status(400).json({ message: 'At least one image is required for the order' })
        if (Total === undefined || Total === null) return res.status(400).json({ message: 'Total estimated price is required' })

        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(404).json({ message: 'Customer not found. Please register the customer first.' })
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
        return res.status(201).json({ message: 'Order created successfully', order: populated })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}


const allOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // Find all customers belonging to this shopkeeper
        const shopkeeperCustomers = await Customer.find({ shopkeeperId: req.user.id }).select('_id')
        const customerIds = shopkeeperCustomers.map(c => c._id)

        const orders = await Order.find({ customerId: { $in: customerIds } })
            .populate('customerId', 'name phone address')
            .sort({ updatedAt: -1 })

        return res.status(200).json({ message: 'Orders fetched successfully', data: orders })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

// PATCH /orders/update?order_id=XXX  — Full order update (items, images, total, etc.)
const updateOrders = async (req, res) => {
    try {
        const { order_id } = req.query
        const { items, image, AdvancePayment, Total, orderStatus, notes, deliveryDate } = req.body

        if (!order_id) return res.status(400).json({ message: 'order_id is required' })

        const existingOrder = await Order.findById(order_id)
        if (!existingOrder) return res.status(404).json({ message: 'Order not found' })

        const advance = Number(AdvancePayment) ?? existingOrder.AdvancePayment
        const total = Number(Total) ?? existingOrder.Total
        if (advance > total) {
            return res.status(400).json({ message: 'Advance payment cannot exceed total amount' })
        }

        const RemainingAmount = total - advance
        const paymentStatus = computePaymentStatus(total, advance)

        const updated = await Order.findByIdAndUpdate(
            order_id,
            {
                ...(items && items.length > 0 ? { items } : {}),
                ...(image && image.length > 0 ? { image } : {}),
                AdvancePayment: advance,
                Total: total,
                RemainingAmount,
                paymentStatus,
                ...(orderStatus ? { orderStatus } : {}),
                ...(notes !== undefined ? { notes } : {}),
                ...(deliveryDate !== undefined ? { deliveryDate } : {})
            },
            { new: true }
        ).populate('customerId', 'name phone address')

        return res.status(200).json({ message: 'Order updated successfully', order: updated })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

// PATCH /orders/pay?order_id=XXX  — Optimized: record a payment / update order status only
const recordOrderPayment = async (req, res) => {
    try {
        const { order_id } = req.query
        const { additionalPayment, orderStatus, notes } = req.body

        if (!order_id) return res.status(400).json({ message: 'order_id is required' })

        const existingOrder = await Order.findById(order_id)
        if (!existingOrder) return res.status(404).json({ message: 'Order not found' })

        const newTotalPaid = existingOrder.AdvancePayment + (Number(additionalPayment) || 0)
        if (newTotalPaid > existingOrder.Total) {
            return res.status(400).json({ message: 'Payment exceeds total order amount' })
        }

        const RemainingAmount = existingOrder.Total - newTotalPaid
        const paymentStatus = computePaymentStatus(existingOrder.Total, newTotalPaid)

        const updated = await Order.findByIdAndUpdate(
            order_id,
            {
                AdvancePayment: newTotalPaid,
                RemainingAmount,
                paymentStatus,
                ...(orderStatus ? { orderStatus } : {}),
                ...(notes !== undefined ? { notes } : {})
            },
            { new: true }
        ).populate('customerId', 'name phone address')

        return res.status(200).json({ message: 'Payment recorded successfully', order: updated })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

// DELETE /orders/delete?order_id=XXX
const deleteOrders = async (req, res) => {
    try {
        const { order_id } = req.query
        if (!order_id) return res.status(400).json({ message: 'order_id is required' })

        const existing = await Order.findById(order_id)
        if (!existing) return res.status(404).json({ message: 'Order not found' })

        await Order.deleteOne({ _id: order_id })
        return res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { createOrders, updateOrders, deleteOrders, allOrders, recordOrderPayment }
