const { sendResponse } = require('../../utils/responseHandler')
const User = require('./userdb.js')
const sec_key = process.env.sec_key
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationInput } = require('../../utils/utils')

const signup = async (req, res) => {
    try {
        const { shopName, name, email, phone, password, role } = req.body
        const value = validationInput({ shopName, name, email, phone, password, role })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendResponse(res, 401, false, "Invalid Email Address")

        }
        if (!/^\d{10}$/.test(phone)) {
            return sendResponse(res, 400, false, "Phone number must be exactly 10 digits");
        }
        if (!/(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
            return sendResponse(res, 400, false, "Password must be at least 8 characters long and contain one special character");
        }

        const exsiting = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (exsiting) {
            return sendResponse(res, 400, false, 'User is already exists')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            shopName, name, email, phone,
            password: hashedPassword, role,
        });
        return sendResponse(res, 201, true, 'Signup successful', { user: newUser })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, "Internal Server Error")
    }
}


const login = async (req, res) => {
    try {
        const { identifier, password, role } = req.body
        
        const value = validationInput({ identifier, password, role })
        if (value) {
            return sendResponse(res, 403, false, `Check missing value ${value}`)
        }
        let existing ;
        if (identifier.includes('@')){
             existing = await User.findOne({ email:identifier, role })
            console.log('object',existing)
        }else{
            const existing = await User.findOne({ phone:identifier, role })
        }
        
        if (!existing) {
            console.log('User not found:', { email, role });
            return sendResponse(res, 404, false, "User not found or Check your Role ")
        } else {
            console.log('User found:', existing.email);
            const isPasswordMatch = bcrypt.compareSync(password, existing.password)
            if (isPasswordMatch) {
                const jwtToken = await jwt.sign(
                    { id: existing.id, email: existing.email, role: existing.role },
                    sec_key,
                    { expiresIn: '1h' }
                )
                const refreshToken = await jwt.sign(
                    { id: existing.id, email: existing.email, role: existing.role },
                    sec_key,
                    { expiresIn: '7d' }
                )
                console.log('Login successful, sending tokens');
                return sendResponse(res, 200, true, "Login Successfully", {
                    user: existing,
                    token: jwtToken,
                    refreshToken
                })

            } else {
                console.log('Password mismatch');
                return sendResponse(res, 401, false, 'Invalid credentials')
            }

        }
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, 'Login Faild', { error: error.message })
    }
}
const setting =  async(req,res)=>{
     try {
        const { shopName, name, email, phone, password, itemNames, purities } = req.body
        const userId = req.user.id

        const user = await User.findById(userId)
        if (!user) {
            return sendResponse(res, 404, false, 'User not found')
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return sendResponse(res, 400, false, 'Email already in use')
        }
        if (phone && phone !== user.phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) return sendResponse(res, 400, false, 'Phone number already in use')
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendResponse(res, 400, false, "Invalid Email Address")
        }
        if (phone && !/^\d{10}$/.test(phone)) {
            return sendResponse(res, 400, false, "Phone number must be exactly 10 digits");
        }

        let updatedData = {
           shopName: shopName || user.shopName,
           name: name || user.name,
           email: email || user.email,
           phone: phone || user.phone
        }

        if (itemNames !== undefined) updatedData.itemNames = itemNames;
        if (purities !== undefined) updatedData.purities = purities;

        if (password && password.trim() !== '') {
            if (!/(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
                return sendResponse(res, 400, false, "Password must be at least 8 characters long and contain one special character");
            }
            updatedData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true })

        return sendResponse(res, 200, true, 'Profile updated successfully', { user: updatedUser })
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, "Internal Server Error")
    }
}


module.exports = {signup,login,setting}