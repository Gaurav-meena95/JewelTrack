const express = require('express')
const { registerCustomer } = require('./controllers')
const router = express.Router()

router.post('/bills/register', registerCustomer)

module.exports = router