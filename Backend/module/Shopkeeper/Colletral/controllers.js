const { sendResponse } = require('../../../utils/responseHandler')
const { validationInput } = require("../../../utils/utils")
const Customer = require('../CustomerRegister/db')
const Collateral = require('../Colletral/db')

const createCollatral = async (req, res) => {
    try {
        if (!req.user || !req.user.id){
            return sendResponse(res, 401, false, 'Unauthorized')
        }
        const shopkeeper_id = req.user.id
        const { phone } = req.query
        const { weight, jewellery, image, price, interestRate, status } = req.body
        const value = validationInput({ jewellery, image, price, interestRate, status,weight })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return sendResponse(res, 400, false, 'User is not exist!');

        }

        const newCollatral = await Collateral.create({ phone,shopkeeperId :shopkeeper_id, customerId:existing._id , jewellery, image, price, interestRate, status, remainingAmount: price,weight })
        return sendResponse(res, 200, true, 'collatral create successfully', { newCollatral })

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')

    }
}


const updateCollatral = async (req, res) => {
    try {
        const { phone ,collatral_id} = req.query
        console.log('dgwgrw',req.body)
        const { weight, jewellery, image, price, interestRate, status, paymentHistory, totalPaid, remainingAmount } = req.body
        const existing = await Customer.findOne({ phone })
        if (!existing) {
            return sendResponse(res, 402, false, 'customer collatral doest not exist')
        }
        const exsitingCollateral = await Collateral.findById(collatral_id)
        const updated = await Collateral.updateOne(
            { _id: exsitingCollateral[0]._id },
            { weight, jewellery, image, price, interestRate, status, paymentHistory, totalPaid, remainingAmount }
        )
        return sendResponse(res, 200, true, "Collateral upadate successfully", { updated })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
    }

}
const deleteCollatral = async (req, res) => {
    try {
        const { phone,collatral_id } = req.query
        const existing = Customer.findOne({ phone })
        if (!existing) {
            return sendResponse(res, 402, false, 'customer collatral doest not exist')
        }
        const exsitingCollateral = await Collateral.find({_id:collatral_id})
        if (exsitingCollateral.length === 0){
            return sendResponse(res, 401, false, 'collatral does not exist')
        }

       const deleted =  await Collateral.deleteOne({ _id: exsitingCollateral[0]._id })
        return sendResponse(res, 200, true, 'collatral successfully deleted', { deleted })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, 'Internal Server Error')
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

    return sendResponse(res, 200, true, "Collaterals fetched", { data });

  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};


module.exports = { createCollatral, updateCollatral, deleteCollatral, allCollatral }

