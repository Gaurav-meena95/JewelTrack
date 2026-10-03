require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
const cors = require('cors')
const connectDB = require('./db/config')
app.use(cors())

// Middleware to ensure DB connection on incoming requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database Connection Error',
            data: { error: error.message }
        });
    }
});

const AuthRoutes = require('./module/Auth/routes')
const GenerateBill = require('./module/Shopkeeper/Billing/routes')
const CustomerRegister = require('./module/Shopkeeper/CustomerRegister/routes')
const Colletral = require('./module/Shopkeeper/Colletral/routes')
const JweleOrders = require('./module/Shopkeeper/Orders/routes')
const JweleInventoryManagment = require('./module/Shopkeeper/Inventory/routes')
const AdminRoutes = require('./module/Admin/routes')
const { verifyUserMiddleware } = require('./module/Auth/middleware')

app.get('/', (req, res) => {
    res.status(200).json('Welcome to Jewel Track')
})

app.use('/api/auth', AuthRoutes)
app.use(verifyUserMiddleware)
app.use('/api/customers', GenerateBill)
app.use('/api/customers', CustomerRegister)
app.use('/api/customers', Colletral)
app.use('/api/customers', JweleOrders)
app.use('/api/shops', JweleInventoryManagment)
app.use('/api/admin', AdminRoutes)







const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

module.exports = app