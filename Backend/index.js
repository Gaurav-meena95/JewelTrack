const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')


const authRoutes = require('./module/Auth/routes')


app.get('/',(req,res)=>{
    res.status(200).json('Hello World!')
})

app.use('/api/auth',authRoutes)






const PORT = process.env.PORT || 3000
app.listen(PORT ,()=>{
    console.log(`server is running on port ${PORT}`)
})