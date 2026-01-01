const express = require('express')
const router = express.Router()
const {createBilling, getBillingProfile, updateBilling } = require('./controllers')

router.post('/bills/create', createBilling)
router.patch('/bills/update', updateBilling)
router.get('/bills/me', getBillingProfile)


module.exports = router


