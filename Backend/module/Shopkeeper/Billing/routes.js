const express = require('express')
const router = express.Router()
const {createBilling, getBillingProfile } = require('./controllers')

router.post('/bills/create', createBilling)
router.get('/bills/me', getBillingProfile)


module.exports = router


