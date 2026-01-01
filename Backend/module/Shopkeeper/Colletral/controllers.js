const { validationInput } = require("../../../utils/utils")
const Customer = require('../CustomerRegister/db')
const Collateral = require('../Colletral/db')

const createCollatral = async (req, res) => {
    try {
        const { phone } = req.query
        const { description, jewellery, image, price, interestRate, status } = req.body
        const value = validationInput({ description, jewellery, image, price, interestRate, status })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(400).json({ message: 'User is not exist!' });
        }
        const newCollatral = await Collateral.create({customerId:existing._id ,description, jewellery, image, price, interestRate, status })
        return res.status(200).json({message:'collatral create successfully',newCollatral})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}


const updateCollatral = async (req, res) => {
    try {
        const { phone ,collatral_id} = req.query
        const { description, jewellery, image, price, interestRate, status } = req.body
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(402).json({ message: 'customer collatral doest not exist' })
        }
        const exsitingCollateral = await Collateral.find({_id:collatral_id})
        const updated = await Collateral.updateOne(
            { _id: exsitingCollateral[0]._id },
            { description, jewellery, image, price, interestRate, status }
        )
        return res.status(200).json({ message: "Collateral upadate successfully", updated })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const deleteCollatral = async (req, res) => {
    try {
        const { phone,collatral_id } = req.query
        const existing = Customer.findOne({ phone })
        if (!existing) {
            return res.status(402).json({ message: 'customer collatral doest not exist' })
        }
        const exsitingCollateral = await Collateral.find({_id:collatral_id})
        if (exsitingCollateral.length === 0){
            return res.status(401).json({message:'collatral does not exist'})
        }

       const deleted =  await Collateral.deleteOne({ _id: exsitingCollateral[0]._id })
        return res.status(200).json({ message: 'collatral successfully deleted' ,deleted})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}
const allCollatral = async (req, res) => {
    try {
        const {phone,name} = req.query
        const allcollatrals = await Collateral.find()
        const spacificCollatral = await Collateral.find({phone})
        if (!spacificCollatral.length === 0){
            return res.status(200).json({ message: "All collatral are :", spacificCollatral })
        }
        return res.status(200).json({ message: "All collatral are :", allcollatrals })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}


module.exports = { createCollatral, updateCollatral, deleteCollatral, allCollatral }

