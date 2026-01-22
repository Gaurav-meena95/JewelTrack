const express = require('express')
const { createOrders, updateOrders, deleteOrders, allOrders } = require('./controllers')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const router = express.Router()
router.use(verifyUserMiddleware)
router.post('/orders/create',createOrders)
router.patch('/orders/update',updateOrders)
router.delete('/orders/delete',deleteOrders)
router.get('/orders/me',allOrders)

module.exports = router
