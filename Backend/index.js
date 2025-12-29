const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')
const connectDB = require('./db/config')
app.use(cors({
    origin:'http://localhost:5174/?',
    credentials:true
}))

const authRoutes = require('./module/Auth/routes')
const customers = require('./module/Shopkeeper/Billing/routes')
const CustomerRegister = require('./module/Shopkeeper/CustomerRegister/routes')


connectDB();
app.get('/',(req,res)=>{
    res.status(200).json('Hello World!')
})
app.use('/api/auth',authRoutes)
app.use('/api/customers/',customers)
app.use('/api/customers/',CustomerRegister)






const PORT = process.env.PORT || 3000
app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`)
})