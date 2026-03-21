const { validationInput } = require("../../../utils/utils")
const Customer = require('../CustomerRegister/db')
const Collateral = require('../Colletral/db')

const createCollatral = async (req, res) => {
    try {
        if (!req.user || !req.user.id){
            return res.status(401).json({message :'Unauthorized'})
        }
        const shopkeeper_id = req.user.id
        const { phone } = req.query
        const { weight, jewellery, image, price, interestRate, status } = req.body
        const value = validationInput({ jewellery, image, price, interestRate, status,weight })
        if (value) {
            return res.status(403).json({ message: `Check missing value ${value}` })
        }
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(400).json({ message: 'User is not exist!' });

        }

        const newCollatral = await Collateral.create({ phone,shopkeeperId :shopkeeper_id, customerId:existing._id , jewellery, image, price, interestRate, status, remainingAmount: price,weight })
        return res.status(200).json({message:'collatral create successfully',newCollatral})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}


const updateCollatral = async (req, res) => {
    try {
        const { phone ,collatral_id} = req.query
        const { weight, jewellery, image, price, interestRate, status, paymentHistory, totalPaid, remainingAmount } = req.body
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return res.status(402).json({ message: 'customer collatral doest not exist' })
        }
        const exsitingCollateral = await Collateral.find({_id:collatral_id})
        const updated = await Collateral.updateOne(
            { _id: exsitingCollateral[0]._id },
            { weight, jewellery, image, price, interestRate, status, paymentHistory, totalPaid, remainingAmount }
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
    const { phone } = req.query;

    let data;

    if (phone) {
      data = await Collateral.find({ phone })
        .populate("customerId", "name phone");
    } else {
      data = await Collateral.find()
        .populate("customerId", "name phone");
    }

    return res.status(200).json({
      message: "Collaterals fetched",
      data
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { createCollatral, updateCollatral, deleteCollatral, allCollatral }

