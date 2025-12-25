
const user = require('../../db/models/user')


exports.createUser  = (user)=>{
   try {
    console.log('userdata:--- ',user )
        const {name ,email,phone,password} = user
    } catch (error) {
        console.log(error)
    }
}