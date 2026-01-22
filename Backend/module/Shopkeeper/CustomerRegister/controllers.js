const { validationInput } = require('../../../utils/utils')
const Customer = require('./db')

const registerCustomer = async (req, res) => {

    try {
        
         if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const {id} = req.user
        const { name, email, phone, father_name, address } = req.body
        const value = validationInput({ name, email, phone, father_name, address })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await Customer.findOne({ phone })
        if (existing) {
            return res.status(400).json({ message: 'Customer Already Exist please search' })
        }
        const newCustomer = await Customer.create({ shopkeeperId:id,name, email, phone, father_name, address })
        console.log('newCustomer', newCustomer)

        return res.status(201).json({ message: 'Customer Create successfully', customer: newCustomer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
const getCustomer = async (req, res) => {

    try {
         if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const { phone } = req.query
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(404).json({ message: "Customer not found register user" });
        }

        return res.status(201).json({ message: 'Customer fetch  successfully', customer: existing })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
const updateCustomer = async (req, res) => {

    try {
        
         if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const {id} = req.user
        const { name, email, phone, father_name, address } = req.body
        const value = validationInput({ name, email, phone, father_name, address })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(400).json({ message: 'Customer Doesnot  Exist please register' })
        }
        const updatedCustomer = await Customer.updateOne({ shopkeeperId:id,name, email, phone, father_name, address })
        console.log('updatedCustomer', updatedCustomer)

        return res.status(201).json({ message: 'Customer update successfully', customer: updatedCustomer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
const deleteCustomer = async (req, res) => {

    try {
         if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const { phone } = req.query
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(404).json({ message: "Customer not found " });
        }
        console.log(existing.id)
        const deleteCustomer = await Customer.deleteOne({_id:existing.id})

        return res.status(201).json({ message: 'Customer delete successfully', customer: deleteCustomer })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}


module.exports = { registerCustomer,updateCustomer ,getCustomer,deleteCustomer}