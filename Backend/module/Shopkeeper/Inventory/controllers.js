const { validationInput } = require("../../../utils/utils")
const User = require('../../Auth/userdb')
const  Inventory= require('./db')


const createInventory = async (req, res) => {
    try {
        const {shopkeeper_id} = req.query
        const { jewelleryType, totalWeight, quantity ,metalType} = req.body
        const value = validationInput({jewelleryType, totalWeight, quantity ,metalType})
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const Shopkeeper= await User.find({_id:shopkeeper_id})
        if (!Shopkeeper){
            return res.status(403).json({message:'shopkeeper does not exist'})
        }

        const newInventory = await Inventory.create({shopkeeper:Shopkeeper.shopkeeper_id,jewelleryType, totalWeight, quantity ,metalType})
        return res.status(200).json({message:'Inventory create successfully',newInventory})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}


const updateInventory = async (req, res) => {
    try {
        const {shopkeeper_id} = req.query
        const { jewelleryType, totalWeight, quantity ,metalType } = req.body
        const value = validationInput({jewelleryType, totalWeight, quantity ,metalType})
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }

        const Shopkeeper= await User.find({_id:shopkeeper_id})
        if (!Shopkeeper){
            return res.status(403).json({message:'shopkeeper does not exist'})
        }
        const updated = await Inventory.updateOne(
            { _id: exsitingCollateral[0]._id },
            {shopkeeper:Shopkeeper.shopkeeper_id,jewelleryType, totalWeight, quantity ,metalType}
        )
        return res.status(200).json({ message: "Collateral upadate successfully", updated })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const deleteInventory = async (req, res) => {
    try {
        const { phone,Inventory_id } = req.query
        const existing = Customer.findOne({ phone })
        if (!existing) {
            return res.status(402).json({ message: 'customer Inventory doest not exist' })
        }
        const exsitingCollateral = await Collateral.find({_id:Inventory_id})
        if (exsitingCollateral.length === 0){
            return res.status(401).json({message:'Inventory does not exist'})
        }

       const deleted =  await Collateral.deleteOne({ _id: exsitingCollateral[0]._id })
        return res.status(200).json({ message: 'Inventory successfully deleted' ,deleted})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const allInventory = async (req, res) => {
    try {
        const {shopkeeper_id} = req.query
        const Shopkeeper= await User.find({_id:shopkeeper_id})
        if (!Shopkeeper){
            return res.status(403).json({message:'shopkeeper does not exist'})
        }
        const allInventorys = await Inventory.find({shopkeeper:Shopkeeper.id})
        return res.status(200).json({ message: "All Inventory are :", allInventorys })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}


module.exports = { createInventory, updateInventory, deleteInventory, allInventory }

