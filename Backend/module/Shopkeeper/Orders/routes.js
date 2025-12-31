const express = require('express')
const { creteOrder } = require('./controllers')
const router = express.Router()

router.post('/orders/create',creteOrder)

module.exports = {router}
