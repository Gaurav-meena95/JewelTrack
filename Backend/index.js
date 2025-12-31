const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')
const connectDB = require('./db/config')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

const authRoutes = require('./module/Auth/routes')
const customers = require('./module/Shopkeeper/Billing/routes')
const CustomerRegister = require('./module/Shopkeeper/CustomerRegister/routes')
const Colletral = require('./module/Shopkeeper/Colletral/routes')
const JweleOrders = require('./module/Shopkeeper/Orders/routes')


connectDB();
app.get('/',(req,res)=>{
    res.status(200).json('Hello World!')
})
app.use('/api/auth',authRoutes)
app.use('/api/customers',customers)
app.use('/api/customers',CustomerRegister)
app.use('/api/customers',Colletral)
app.use('/api/customers',JweleOrders)






const PORT = process.env.PORT || 3000
app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`)
})