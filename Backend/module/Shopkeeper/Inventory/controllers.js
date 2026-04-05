const { sendResponse } = require('../../../utils/responseHandler')
const { validationInput } = require("../../../utils/utils")
const User = require('../../Auth/userdb')
const Inventory = require('./db')


const createInventory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const shopkeeper_id = req.user.id
        const { jewelleryType, totalWeight, quantity, metalType } = req.body
        const value = validationInput({ jewelleryType, totalWeight, quantity, metalType })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }
        const existing = await Inventory.findOne({
            shopkeeperId: shopkeeper_id,
            jewelleryType: jewelleryType.trim()
        })

        if (existing) {
            return sendResponse(res, 400, false, "Inventory already exists for this jewellery type")
        }
        const newInventory = await Inventory.create({ shopkeeperId: shopkeeper_id, jewelleryType, totalWeight, quantity, metalType })
        return sendResponse(res, 200, true, 'Inventory create successfully', { newInventory })

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')

    }
}

const updateInventory = async (req, res) => {
    try {
        const { inventory_id } = req.query
        const { jewelleryType, totalWeight, quantity, metalType } = req.body
        const value = validationInput({ jewelleryType, totalWeight, quantity, metalType })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }

        const exsitingInventory = await Inventory.find({ _id: inventory_id })
        const updated = await Inventory.updateOne(
            { _id: exsitingInventory[0]._id },
            { jewelleryType, totalWeight, quantity, metalType }
        )
        return sendResponse(res, 200, true, "Inventory upadate successfully", { updated })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }

}
const deleteInventory = async (req, res) => {
    try {
        const { inventory_id } = req.query
        const exsitingInventory = await Inventory.find({ _id: inventory_id })
        if (exsitingInventory.length === 0) {
            return sendResponse(res, 401, false, 'Inventory does not exist')
        }

        const deleted = await Inventory.deleteOne({ _id: exsitingInventory[0]._id })
        return sendResponse(res, 200, true, 'Inventory successfully deleted', { deleted })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }

}
const allInventory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const shopkeeper_id = req.user.id
        const Shopkeeper = await User.find({ _id: shopkeeper_id })
        const allInventorys = await Inventory.find({ shopkeeperId: shopkeeper_id })
        return sendResponse(res, 200, true, "All Inventory are :", { allInventorys })


    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }

}


module.exports = { createInventory, updateInventory, deleteInventory, allInventory }

