const express = require('express')
const { registerCustomer, updateCustomer, getCustomer, deleteCustomer } = require('./controllers')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const router = express.Router()

router.use(verifyUserMiddleware)
router.post('/register',registerCustomer)
router.patch('/register/update',updateCustomer)
router.get('/register/get',getCustomer)
router.delete('/register/delete',deleteCustomer)


module.exports = router