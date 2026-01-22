const express = require('express')
const { createCollatral, updateCollatral, deleteCollatral, allCollatral,} = require('./controllers')
const { verifyUserMiddleware } = require('../../Auth/middleware')
const router = express.Router()

router.use(verifyUserMiddleware)
router.post('/collatral/create',createCollatral)
router.patch('/collatral/update',updateCollatral)
router.delete('/collatral/delete',deleteCollatral)
router.get('/collatral/me',allCollatral)
module.exports = router