const { validationInput } = require('../../../utils/utils')
const Customer = require('./db')

const registerCustomer = async (req, res) => {

    try {
        const { name, email, phone, father_name, address } = req.body
        const value = validationInput({ name, email, phone, father_name, address })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await Customer.findOne({ phone })
        if (existing) {
            return res.status(400).json({ message: 'Customer Already Exist please search' })
        }
        const newCustomer = await Customer.create({ name, email, phone, father_name, address })
        console.log('newCustomer', newCustomer)

        return res.status(201).json({ message: 'Customer Create successfully', customer: newCustomer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { registerCustomer }