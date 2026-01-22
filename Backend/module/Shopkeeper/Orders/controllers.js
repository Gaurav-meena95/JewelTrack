const { validationInput } = require('../../../utils/utils')
const Order = require('../Orders/db')
const Customer = require('../CustomerRegister/db')

const createOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id){
            return res.status(401).json({message :'Unauthorized'})
        }
        const shopkeeper_id = req.user.id
        const { phone } = req.query
        const { jewellery, image, AdvancePayment, Total, status, size } = req.body
        const value = validationInput({ jewellery, image, AdvancePayment, Total, status, size })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await Customer.findOne({ phone })
        if (!existing) {

            return res.status(400).json({ message: 'customer is already exist' })
        }
        const RemaningAmount = Total - AdvancePayment
        const newOrders = await Order.create({shopkeeperId:shopkeeper_id, customerId: existing._id, jewellery, image, AdvancePayment, Total, status, size, RemaningAmount })
        return res.status(201).json({ message: 'Orders create successfully', newOrders })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}

const updateOrders = async (req, res) => {
    try {
        const { phone ,order_id} = req.query
        const { jewellery, image, AdvancePayment, Total, status, size } = req.body
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(402).json({ message: 'customer  doest not exist' })
        }
        const exsitingOrders = await Order.find({ _id:order_id  })
        const RemaningAmount = Total - AdvancePayment
        const updated = await Order.updateOne(
            { _id: exsitingOrders[0]._id },
            { jewellery, image, AdvancePayment, Total, status, size, RemaningAmount }
        )
        return res.status(200).json({ message: "Order upadate successfully", updated })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const deleteOrders = async (req, res) => {
    try {
        const { phone ,order_id} = req.query
        const existing = Customer.findOne({ phone })
        if (!existing) {
            return res.status(402).json({ message: 'customer Orders doest not exist' })
        }
        const exsitingOrders = await Order.find({ _id:order_id  })
        
        const deletedorder = await Order.deleteOne({ _id: exsitingOrders[0]._id })
        return res.status(200).json({ message: 'Orders successfully deleted' ,deletedorder})
    } catch (error) {

        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const allOrders = async (req, res) => {
    try {
        const allOrders = await Order.find()
        return res.status(200).json({ message: "All Orders", allOrders })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}


module.exports = { createOrders, updateOrders, deleteOrders, allOrders }
