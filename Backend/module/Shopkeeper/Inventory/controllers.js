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
        console.log('shopkeeper' ,Shopkeeper[0]._id)
        if (!Shopkeeper){
            return res.status(403).json({message:'shopkeeper does not exist'})
        }

        const newInventory = await Inventory.create({shopkeeper:Shopkeeper[0]._id,jewelleryType, totalWeight, quantity ,metalType})
        return res.status(200).json({message:'Inventory create successfully',newInventory})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}


const updateInventory = async (req, res) => {
    try {
        const {inventory_id} = req.query
        const { jewelleryType, totalWeight, quantity ,metalType } = req.body
        const value = validationInput({jewelleryType, totalWeight, quantity ,metalType})
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }

        const exsitingInventory = await Inventory.find({_id:inventory_id})
        const updated = await Inventory.updateOne(
            { _id: exsitingInventory[0]._id },
            {jewelleryType, totalWeight, quantity ,metalType}
        )
        return res.status(200).json({ message: "Inventory upadate successfully", updated })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const deleteInventory = async (req, res) => {
    try {
        const { inventory_id } = req.query
        const exsitingInventory = await Inventory.find({_id:inventory_id})
        if (exsitingInventory.length === 0){
            return res.status(401).json({message:'Inventory does not exist'})
        }

       const deleted =  await Inventory.deleteOne({ _id: exsitingInventory[0]._id })
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
        const allInventorys = await Inventory.find({shopkeeper:Shopkeeper[0]._id})
        return res.status(200).json({ message: "All Inventory are :", allInventorys })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}


module.exports = { createInventory, updateInventory, deleteInventory, allInventory }

