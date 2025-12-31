const { validationInput } = require("../../../utils/utils")
const Customer = require('../CustomerRegister/db')
const Collateral = require('../Colletral/db')

const createCollatral = async(req, res) => {
    try {
        const { description, jewellery, image, price, interestRate, status } = req.body
        const value = validationInput({ description, jewellery, image, price, interestRate, status })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing =await Customer.findOne({ phone })
        if (existing) {
            return res.status(400).json({ message: 'customer is already exist' })
        }
        const newCollatral = await Collateral.create({ description, jewellery, image, price, interestRate, status })

    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'Internal Server Error'})

    }
}

const updateCollatral = async (req, res) => {
    try {
        const {phone} = req.query
        const { description, jewellery, image, price, interestRate, status } = req.body
        const existing = await Customer.findOne({ phone })
        if (!existing){
            return res.status(402).json({message:'customer collatral doest not exist'})
        }
        const updated =  await Collateral.updateOne(
            { _id: existing._id }, 
            {description, jewellery, image, price, interestRate, status}
        )
        return res.status(200).json({message:"Collateral upadate successfully",updated})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'Internal Server Error'})
    }

}
const deleteCollatral =  async (req, res) => {
    try {
        const {phone} = req.query
        const existing = Customer.findOne({ phone })
        if (!existing){
            return res.status(402).json({message:'customer collatral doest not exist'})
        }
        await Collateral.deleteOne({_id:existing._id})
        return res.status({message :'collatral successfully deleted'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'Internal Server Error'})
    }

}
const allCollatral = async(req, res) => {
    try {
        const allcollatrals  = await Collateral.find() 
        return res.status({message:"All collatral are :",allcollatrals})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'Internal Server Error'})
    }

}


module.exports = { createCollatral, updateCollatral, deleteCollatral, allCollatral }

