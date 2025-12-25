const {createUser} = require('./service')
exports.signup = (req,res)=>{
    try {
        const userSignup = createUser(req.body)
    } catch (error) {
        
    }
} 