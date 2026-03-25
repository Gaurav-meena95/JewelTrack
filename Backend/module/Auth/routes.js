const express = require('express')
const router = express.Router()
const {signup, login, setting} = require('./controllers')
const {verifyUserMiddleware} = require('./middleware')

const User = require('./userdb')

router.post('/signup',signup)
router.post('/login',login)

router.patch('/shopkeeper/setting', verifyUserMiddleware, setting)

router.get('/me', verifyUserMiddleware, async (req, res)=>{
    try {
        const fullUser = await User.findById(req.user.id).select("-password")
        if (!fullUser) return res.status(404).json({ message: "User not found" })
        res.status(200).json({ user: fullUser })
    } catch(err) {
        res.status(500).json({ message: "Error fetching user profile" })
    }
})

module.exports = router


