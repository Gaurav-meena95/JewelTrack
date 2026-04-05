const { sendResponse } = require('../../../utils/responseHandler')
const { validationInput } = require('../../../utils/utils')
const Customer = require('./db')
const Bill = require('../Billing/db')
const Order = require('../Orders/db')
const Collateral = require('../Colletral/db')

const registerCustomer = async (req, res) => {

    try {
         if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const {id} = req.user
        const { name, email, phone, father_name, address } = req.body
        const value = validationInput({ name, phone, father_name, address })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }
        const existing = await Customer.findOne({ phone })
        if (existing) {
            return sendResponse(res, 400, false, 'Customer Already Exist please search')
        }
        const newCustomer = await Customer.create({ shopkeeperId:id,name, email, phone, father_name, address })
        console.log('newCustomer', newCustomer)

        return sendResponse(res, 201, true, 'Customer Create successfully', { customer: newCustomer })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}
const getCustomer = async (req, res) => {

    try {
         if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const { phone } = req.query
        const allCustomer = await Customer.find()
        const existing = await Customer.findOne({ phone })
        if (existing) {
            console.log(existing)
            return sendResponse(res, 201, true, 'Customer fetch  successfully', { customer: existing })
        } else if (phone) {
            return sendResponse(res, 404, false, "Customer not found register user");
        } else {
            return sendResponse(res, 201, true, 'All Customer fetch  successfully', { customer: allCustomer })
        }
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}
const updateCustomer = async (req, res) => {

    try {
        
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const {id} = req.user
        const { name, email, phone, father_name, address } = req.body
        const value = validationInput({ name, phone, father_name, address })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return sendResponse(res, 400, false, 'Customer Doesnot  Exist please register')
        }
        const updatedCustomer = await Customer.updateOne({ shopkeeperId:id,name, email , father_name, address })
        console.log('updatedCustomer', updatedCustomer)

        return sendResponse(res, 201, true, 'Customer update successfully', { customer: updatedCustomer })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}
const deleteCustomer = async (req, res) => {

    try {
         if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const { phone } = req.query
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return sendResponse(res, 404, false, "Customer not found ")
        }
        console.log(existing.id)
        const deleteCustomer = await Customer.deleteOne({_id:existing.id})

        return sendResponse(res, 201, true, 'Customer delete successfully', { customer: deleteCustomer })

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}

const getCustomerDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const { id } = req.query
        
        if (!id) {
             return sendResponse(res, 400, false, 'Customer ID is required')
        }

        const customer = await Customer.findById(id)
        if (!customer) {
            return sendResponse(res, 404, false, 'Customer not found')
        }

        // Fetch associated data
        const bills = await Bill.find({ customerId: id }).sort({ createdAt: -1 })
        const orders = await Order.find({ customerId: id }).sort({ createdAt: -1 })
        const collaterals = await Collateral.find({ customerId: id }).sort({ createdAt: -1 })

        return sendResponse(res, 200, true, 'Customer details fetched successfully', { 
            customer,
            bills,
            orders,
            collaterals
        })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }
}

module.exports = { registerCustomer, updateCustomer, getCustomer, deleteCustomer, getCustomerDetails }