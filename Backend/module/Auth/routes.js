const express = require('express')
const router = express.Router()
const {signup} = require('./controllers')
const {login} =require('./controllers')
const {verifyUserMiddleware} = require('./middleware')

router.post('/signup',verifyUserMiddleware,signup)
router.post('/login',verifyUserMiddleware,login)

module.exports = router


