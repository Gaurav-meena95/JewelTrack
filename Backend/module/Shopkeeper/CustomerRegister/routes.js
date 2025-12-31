const express = require('express')
const { registerCustomer } = require('./controllers')
const router = express.Router()

router.post('/register', registerCustomer)

module.exports = router